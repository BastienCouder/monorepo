'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/lib/prisma';
import type { SearchParams } from '@/types';

import { filterColumn } from '@/lib/filter-column';

import { User } from '@prisma/client';
import { searchParamsSchema } from '@/schemas/page-params';

export async function getUsers(searchParams: SearchParams) {
  noStore();
  try {
    const { page, per_page, sort, email, role, operator } =
      searchParamsSchema.parse(searchParams);

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage =
      isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
    // Column and order to sort by
    // Splitting the sort string by "." to get the column and order
    // Example: "email.desc" => ["email", "desc"]
    const [column, order] = (sort?.split('.') as [
      keyof User | undefined,
      'asc' | 'desc' | undefined,
    ]) ?? ['email', 'desc'];

    const roles = (role?.split('.') as User['role'][]) ?? [];

    const getAllUsers = db.user.findMany({
      take: limit,
      skip: offset,
      where:
        !operator || operator === 'and'
          ? {
              // Filter users by email
              email: email
                ? filterColumn({
                    value: email,
                  })
                : undefined,
              // Filter users by role
              role: roles.length > 0 ? { in: roles } : undefined,
            }
          : {
              OR: [
                {
                  // Filter users by email
                  email: email
                    ? filterColumn({
                        value: email,
                      })
                    : undefined,
                },
                {
                  // Filter users by role
                  role: roles.length > 0 ? { in: roles } : undefined,
                },
              ],
            },
      orderBy: column
        ? order === 'asc'
          ? { [column]: 'asc' }
          : { [column]: 'desc' }
        : { id: 'desc' },
    });

    const getAllUsersCount = db.user.aggregate({
      _count: true,
      where:
        !operator || operator === 'and'
          ? {
              // Filter users by email
              email: email
                ? filterColumn({
                    value: email,
                  })
                : undefined,
              // Filter users by role
              role: roles.length > 0 ? { in: roles } : undefined,
            }
          : {
              OR: [
                {
                  // Filter users by email
                  email: email
                    ? filterColumn({
                        value: email,
                      })
                    : undefined,
                },
                {
                  // Filter users by role
                  role: roles.length > 0 ? { in: roles } : undefined,
                },
              ],
            },
    });

    // Transaction is used to ensure both queries are executed in a single transaction
    const [data, count] = await db.$transaction([
      getAllUsers,
      getAllUsersCount,
    ]);

    // console.log({ c: count._count });
    const pageCount = Math.ceil(count._count / limit);

    return { data, pageCount };
  } catch (err) {
    console.log(err);
    return { data: [], pageCount: 0 };
  }
}

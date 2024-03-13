'use client';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { CourseProgress } from '@/components/course-progress';

import { CourseSidebarItem } from './course-sidebar-item';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const session = useCurrentUser();
  const userId = session?.id;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId: course.id,
  //     },
  //   },
  // });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div
        className={`px-4 flex xl:fixed  top-0 gap-4 flex flex-col xl:flex-row items-center lg:px-4 py-4 z-50 transition-all ${isScrolled ? 'bg-background border-b xl:w-full' : 'xl:w-3/5'}`}
      >
        <h1
          className={`w-full  text-xl xl:text-base font-semibold capitalize transition-all ${isScrolled ? 'xl:w-1/5' : 'xl:w-2/5'}`}
        >
          {course.title}
        </h1>
        <div className="w-full xl:w-2/3">
          {userId && <CourseProgress variant="success" value={progressCount} />}
        </div>
      </div>
      <div className="mb-6 xl:mb-0 px-4 xl:px-0 xl:flex-col flex-row flex-wrap gap-2 xl:gap-0 max-w-full flex">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !userId}
          />
        ))}
      </div>
      <Separator />
    </div>
  );
};

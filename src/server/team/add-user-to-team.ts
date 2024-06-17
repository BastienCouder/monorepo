async function addTeamMember(teamId, userId, role) {
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId, userId },
    },
  });
  if (existing + Member) {
    throw new Error('This user is already a member of the team.');
  }
  return prisma.teamMember.create({
    data: { teamId, userId, role },
  });
}

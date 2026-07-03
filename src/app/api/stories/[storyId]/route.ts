type StoryRouteProps = {
  params: Promise<{
    storyId: string;
  }>;
};

export async function GET(_request: Request, { params }: StoryRouteProps) {
  const { storyId } = await params;

  return Response.json({
    message: "Story by ID API route is working",
    storyId,
  });
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Education content for course {courseId}, lesson {lessonId} will be loaded here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

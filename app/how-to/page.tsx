import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowToPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">How-To Guide</h1>
        <p className="text-muted-foreground mt-2">Learn how to use IdeaForge effectively</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Creating a New Idea</CardTitle>
            <CardDescription>Step-by-step guide to creating innovative ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the "Ideas Hub".</li>
              <li>Click on the "Create New Idea" button.</li>
              <li>Fill out the form with your idea details.</li>
              <li>Click "Submit Idea" to save your idea.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collaborating on Ideas</CardTitle>
            <CardDescription>How to work with others on your ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the idea you want to collaborate on.</li>
              <li>Add collaborator email addresses in the "Collaborators" field.</li>
              <li>Collaborators will receive an invitation to join.</li>
              <li>Collaborators can view, comment, and contribute to the idea.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Converting Ideas to Projects</CardTitle>
            <CardDescription>Transform your ideas into structured projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the idea you want to convert.</li>
              <li>Click on the "Convert to Project" button.</li>
              <li>Fill out the project details, including resources, timeline, and objectives.</li>
              <li>Click "Create Project" to finalize the conversion.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requesting Idea Approval</CardTitle>
            <CardDescription>Get your ideas approved by stakeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the idea you want to request approval for.</li>
              <li>Click on the "Request Approval" button.</li>
              <li>Select the approvers from the list.</li>
              <li>Add a message for the approvers and submit the request.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Using AI Insights</CardTitle>
            <CardDescription>Leverage AI to enhance your ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the idea you want to enhance.</li>
              <li>Navigate to the "AI Insights" section.</li>
              <li>Review the AI-generated recommendations and suggestions.</li>
              <li>Apply the insights to improve your idea.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Account Settings</CardTitle>
            <CardDescription>Customize your IdeaForge experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click on your profile icon in the header.</li>
              <li>Select "Settings" from the dropdown menu.</li>
              <li>Update your profile information, change your password, and manage notification preferences.</li>
              <li>Click "Save Changes" to apply your settings.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

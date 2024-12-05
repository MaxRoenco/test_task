import { Ticket, columns } from "./columns"
import { DataTable } from "./data-table"

export async function getData(): Promise<Ticket[]> {
  // Fetch data from your API here.
  return [
    {
    "id": 1,
      "bug_type": "UI",
      "subject": "Button alignment issue",
      "text": "The submit button on the registration form is misaligned on mobile devices.",
      "created_at": "2024-12-01T12:34:56Z",
      "updated_at": "2024-12-02T08:00:00Z",
      "status": "open",
      "priority": "medium"
    },
    {
    "id": 2,
      "bug_type": "Performance",
      "subject": "Page loading delay",
      "status": "closed",
      "text": "The homepage takes over 5 seconds to load during peak hours.",
      "created_at": "2024-12-01T12:34:56Z",
      "updated_at": "2024-12-02T08:00:00Z",
      "priority": "high"
    },
    {
      "id": 3, 
      "bug_type": "Functional",
      "subject": "Login failure",
      "text": "Users are unable to log in with valid credentials after resetting their password.",
      "created_at": "2024-12-01T12:34:56Z",
      "updated_at": "2024-12-02T08:00:00Z",
      "status": "in work",
      "priority": "low"
    }
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

import { Ticket, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Ticket[]> {
  // Fetch data from your API here.
  return [
    {
      "id": 1376,
      "subject": "Footer text overlaps on small screens",
      "bug_type": "UI/UX",
      "status": "open"
    },
    {
      "id": 1377,
      "subject": "Button color changes on hover in dark mode",
      "bug_type": "UI/UX",
      "status": "in work"
    },
    {
      "id": 1378,
      "subject": "Modal window not centered on small screens",
      "bug_type": "UI/UX",
      "status": "open"
    },
    {
      "id": 1379,
      "subject": "API response delay on search function",
      "bug_type": "Performance",
      "status": "in work"
    },
    {
      "id": 1380,
      "subject": "Sidebar expands incorrectly on page load",
      "bug_type": "UI/UX",
      "status": "closed"
    },
    {
      "id": 1381,
      "subject": "Text input field not focused on page load",
      "bug_type": "UI/UX",
      "status": "open"
    },
    {
      "id": 1382,
      "subject": "Page title not updating after navigation",
      "bug_type": "Bug",
      "status": "closed"
    },
    {
      "id": 1383,
      "subject": "Navigation menu covers content on small screens",
      "bug_type": "UI/UX",
      "status": "in work"
    },
    {
      "id": 1384,
      "subject": "Incorrect icons displayed in notifications",
      "bug_type": "UI/UX",
      "status": "closed"
    },
    {
      "id": 1385,
      "subject": "Search bar doesn't clear on button click",
      "bug_type": "Bug",
      "status": "open"
    },
    {
      "id": 1386,
      "subject": "Image carousel doesn’t display next image",
      "bug_type": "UI/UX",
      "status": "in work"
    },
    {
      "id": 1387,
      "subject": "Font size too large on mobile devices",
      "bug_type": "UI/UX",
      "status": "open"
    },
    {
      "id": 1388,
      "subject": "User profile page not loading",
      "bug_type": "Bug",
      "status": "closed"
    },
    {
      "id": 1389,
      "subject": "Dropdown menu cuts off on page resize",
      "bug_type": "UI/UX",
      "status": "in work"
    },
    {
      "id": 1390,
      "subject": "Image background not responsive on homepage",
      "bug_type": "UI/UX",
      "status": "open"
    },
    {
      "id": 1391,
      "subject": "Search function not returning correct results",
      "bug_type": "Bug",
      "status": "closed"
    },
    {
      "id": 1392,
      "subject": "Incorrect padding in card components",
      "bug_type": "UI/UX",
      "status": "in work"
    },
    {
      "id": 1393,
      "subject": "Hover effect not working on links",
      "bug_type": "UI/UX",
      "status": "closed"
    },
    {
      "id": 1394,
      "subject": "Pagination not working on search results",
      "bug_type": "Bug",
      "status": "open"
    },
    {
      "id": 1395,
      "subject": "Contact form not submitting correctly",
      "bug_type": "Bug",
      "status": "in work"
    },
    {
      "id": 1396,
      "subject": "Tooltip not appearing on button hover",
      "bug_type": "UI/UX",
      "status": "open"
    },
    {
      "id": 1397,
      "subject": "Login form resets after unsuccessful login",
      "bug_type": "UI/UX",
      "status": "closed"
    },
    {
      "id": 1398,
      "subject": "CSS grid layout breaks on larger screens",
      "bug_type": "UI/UX",
      "status": "in work"
    },
    {
      "id": 1399,
      "subject": "Incorrect sorting on product list",
      "bug_type": "Bug",
      "status": "open"
    },
    {
      "id": 1400,
      "subject": "Image not displaying on product detail page",
      "bug_type": "UI/UX",
      "status": "in work"
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

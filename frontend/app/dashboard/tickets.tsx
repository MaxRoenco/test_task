export default [
    {
        "id": 1,
        "bug_type": "UI",
        "subject": "Button alignment issue",
        "text": "The submit button on the registration form is misaligned on mobile devices.",
        "priority": "High",
        "status": "Open",
        "created_at": "2024-12-01T12:34:56Z",
        "updated_at": "2024-12-02T08:00:00Z",
        "attachments": [
            {
                "id": 1,
                "filename": "screenshot_misalignment.png",
                "url": "https://example.com/screenshots/1",
                "uploaded_at": "2024-12-01T12:35:00Z"
            }
        ],
        "messages": [
            {
                "id": 1,
                "user": {
                    "id": 1,
                    "name": "Nick"
                },
                "text": "Hello, is the problem fixed?",
                "timestamp": "2024-12-01T12:40:00Z"
            },
            {
                "id": 2,
                "user": {
                    "id": 2,
                    "name": "Alice Johnson",
                    "role": "Frontend Developer"
                },
                "text": "We're looking into this issue and will update shortly.",
                "timestamp": "2024-12-01T14:00:00Z"
            }
        ]
    },
    {
        "id": 2,
        "bug_type": "Performance",
        "subject": "Slow loading of homepage",
        "text": "The homepage takes more than 5 seconds to load, especially when there are a lot of images.",
        "priority": "Medium",
        "status": "In Progress",
        "created_at": "2024-12-02T09:15:00Z",
        "updated_at": "2024-12-02T10:30:00Z",
        "attachments": [],
        "messages": [
            {
                "id": 1,
                "user": {
                    "id": 3,
                    "name": "John Doe"
                },
                "text": "This issue is due to the unoptimized image files. We are working on reducing the size.",
                "timestamp": "2024-12-02T09:45:00Z"
            },
            {
                "id": 2,
                "user": {
                    "id": 4,
                    "name": "Sarah Lee",
                    "role": "Backend Developer"
                },
                "text": "I will adjust the server-side caching to help speed things up.",
                "timestamp": "2024-12-02T10:20:00Z"
            }
        ]
    },
    {
        "id": 3,
        "bug_type": "Security",
        "subject": "Weak password validation",
        "text": "The password field allows users to set simple passwords like '12345' which are not secure.",
        "priority": "High",
        "status": "Open",
        "created_at": "2024-12-03T11:00:00Z",
        "updated_at": "2024-12-03T11:00:00Z",
        "attachments": [],
        "messages": [
            {
                "id": 1,
                "user": {
                    "id": 5,
                    "name": "Tommy Smith"
                },
                "text": "We need to enforce stronger password criteria. Adding a minimum length and special characters.",
                "timestamp": "2024-12-03T11:10:00Z"
            }
        ]
    },
    {
        "id": 4,
        "bug_type": "API",
        "subject": "500 Error on API call",
        "text": "The /users endpoint returns a 500 internal server error when trying to fetch the user list.",
        "priority": "Critical",
        "status": "Resolved",
        "created_at": "2024-12-04T14:22:00Z",
        "updated_at": "2024-12-04T15:10:00Z",
        "attachments": [
            {
                "id": 1,
                "filename": "error_log.txt",
                "url": "https://example.com/logs/1",
                "uploaded_at": "2024-12-04T14:30:00Z"
            }
        ],
        "messages": [
            {
                "id": 1,
                "user": {
                    "id": 6,
                    "name": "Chris Barlow"
                },
                "text": "The server crashed due to a misconfigured database query. It's fixed now.",
                "timestamp": "2024-12-04T14:45:00Z"
            },
            {
                "id": 2,
                "user": {
                    "id": 7,
                    "name": "Rachel Adams",
                    "role": "DevOps Engineer"
                },
                "text": "We have deployed the fix and the endpoint is now working.",
                "timestamp": "2024-12-04T15:00:00Z"
            }
        ]
    },
    {
        "id": 5,
        "bug_type": "UI",
        "subject": "Text field placeholder issue",
        "text": "The placeholder text in the search input field is not visible in dark mode.",
        "priority": "Low",
        "status": "Open",
        "created_at": "2024-12-05T08:30:00Z",
        "updated_at": "2024-12-05T08:35:00Z",
        "attachments": [],
        "messages": [
            {
                "id": 1,
                "user": {
                    "id": 8,
                    "name": "Linda"
                },
                "text": "This is an issue with the color scheme. I will change the placeholder color.",
                "timestamp": "2024-12-05T08:40:00Z"
            }
        ]
    }
]

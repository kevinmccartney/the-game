# Data Models

## User Notification

uid: str
type: 'user-onboarding'
created_time: str
payload: dict
id: string

// User
// uid: $Admin,$Self,$Friend,$Anon
// display_name: string; $Admin,$Self,$Friend,$Anon
// display_name_normalized: string; # No one, solely used for search
// username: string; $Admin,$Self,$Friend,$Anon
// photo_url: string | null; $Admin,$Self,$Friend,$Anon
// id: string; $Admin,$Self,$Friend,$Anon
// join_date: string $Admin,$Self,$Friend
// location: string | null; $Admin,$Self,$Friend
// about_me: string | null; $Admin,$Self,$Friend
// likes: Array<string> $Admin,$Self,$Friend
// friends: Array<string> $Admin,$Self,$Friend # ARRAY OF UIDs. Exposed by /v1/users/{id}/friends
// dislikes: Array<string> $Admin,$Self,$Friend
// email: string; $Admin,$Self
// phone_number: string | null; $Admin,$Self

// Admin User returned by API
// User - $Self
// Friend - $Friend
// AnonymousUser - $Anon

export type User = {
  display_name: string;
  email: string;
  phone_number: null | string;
  photo_url: null | string;
  uid: string;
};

// User
// uid: $Admin,$Self,$Friend,$Anon
// display_name: string; $Admin,$Self,$Friend,$Anon
// display_name_normalized: string; # No one, solely used for search
// username: string; $Admin,$Self,$Friend,$Anon
// photo_url: string; $Admin,$Self,$Friend,$Anon
// join_date: Date $Admin,$Self,$Friend
// location: string; $Admin,$Self,$Friend
// about_me: string; $Admin,$Self,$Friend
// likes: Array<string> $Admin,$Self,$Friend
// friends: Array<string> $Admin,$Self,$Friend # ARRAY OF UIDs. Exposed by /v1/users/{id}/friends
// dislikes: Array<string> $Admin,$Self,$Friend
// email: string; $Admin,$Self
// phone_number: string; $Admin,$Self

// Admin User returned by API
// User - $Self
// Friend - $Friend
// AnonymousUser - $Anon

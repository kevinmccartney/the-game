export type EditProfileFormKey =
  | 'about_me'
  | 'dislikes'
  | 'display_name'
  | 'email'
  | 'likes'
  | 'location'
  | 'phone_number'
  | 'photo_url'
  | 'username';

export type EditProfileForm = {
  about_me: null | string;
  dislikes: string;
  display_name: string;
  email: string;
  likes: string;
  location: null | string;
  phone_number: null | string;
  photo_url: null | string;
  username: string;
};

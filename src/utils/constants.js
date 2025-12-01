export const globalRegex = {
  // password must contain at least one uppercase letter, one lowercase letter, one number, and one special character ex : Abcd@1234
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  // phone number in E.164 format (e.g., +1234567890)
  phoneRegex: /^\+?[1-9]\d{1,14}$/,
  // name must be 3-30 characters long and can include Arabic letters, English letters, spaces, and certain punctuation ex : John Doe, أحمد محمد
  nameRegex: /^[a-zA-Z\u0600-\u06FF\s'-]{3,30}$/,
  // standard email format ex : user@example.com
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ,
  // URL to an image file (jpg, jpeg, png) ex : https://res.cloudinary.com/demo/image/upload/sample.jpg
  profileImageRegex: /^https?:\/\/.+\.(jpg|jpeg|png)$/i,
  // Date in YYYY-MM-DD format ex : 2023-10-15
  dateRegex: /^\d{4}-\d{2}-\d{2}$/
}
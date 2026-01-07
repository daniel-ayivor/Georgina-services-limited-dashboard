# Backend API Requirement for Booking Delete Functionality

## Required Endpoint

The booking delete functionality on the frontend requires the following backend API endpoint:

### DELETE /api/admin/bookings/:id

**Description:** Deletes a booking by ID

**Route Definition:**
```javascript
router.delete('/api/admin/bookings/:id', deleteBooking);
```

**Parameters:**
- `id` (URL parameter): The booking ID to delete

**Example Request:**
```http
DELETE /api/admin/bookings/123
Authorization: Bearer <admin-token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully",
  "data": {
    "id": "123"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Booking not found",
  "error": "No booking found with ID 123"
}
```

## Implementation Notes

1. The frontend already calls this endpoint via `adminApiService.deleteAdminCleaningBooking(id)`
2. The endpoint should require admin authentication
3. Should return appropriate status codes:
   - 200: Success
   - 404: Booking not found
   - 403: Unauthorized
   - 500: Server error

## Frontend Files Updated

- `src/pages/BookingDetails.tsx` - New full-page booking details view
- `src/pages/Bookings.tsx` - Updated to navigate to dedicated booking page
- `src/App.tsx` - Added route for `/admin/bookings/:id`
- `src/contexts/adminApiService.ts` - Already has `deleteAdminCleaningBooking()` method

## Testing the Frontend

Once the backend endpoint is implemented, you can test:

1. Navigate to `/bookings` in the admin dashboard
2. Click on any booking ID or the "View" button
3. You'll be taken to the full-page booking details view
4. Click the "Delete Booking" button
5. Confirm the deletion in the dialog
6. The booking should be deleted and you'll be redirected to the bookings list

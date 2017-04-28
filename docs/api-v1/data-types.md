# Data types
The API uses some standardized data types.

## Date/Time
A point in time is represented by an ISO 8601 formatted string. GMT (UTC) is the
only time zone used in responses. All time zones are accepted in requests, 
however. 

Examples:
* `2000-01-01T12:00:00Z`
* `2000-01-01T12:00:00.123456Z`
* `2000-01-01T12:00:00+00:00`
* `2000-01-01T12:00:00.123456+00:00`

## ID
All canonical IDs in this API are UUIDs, formatted as lowercase hex strings with
dashes. 

Example: `25faeebb-5810-4484-a69c-960d1b77a261`

## URL
In general, URLs are used to refer to API resources. Full URLs, including scheme 
and host are used in these cases. 

Example: `https://kobra.karservice.se/api/v1/students/25faeebb-5810-4484-a69c-960d1b77a261/`

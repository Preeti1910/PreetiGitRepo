# Sample Queries and Expected Outputs

This document lists sample natural-language queries the agent can answer, along with the expected SQL it generates and the expected output format.

## 1. Booking Status Analysis

**Query:** How many bookings fall under each Booking Status?

**Expected SQL:**
```sql
SELECT [Booking Status], COUNT(*) AS Count
FROM tbl_ride_bookings
GROUP BY [Booking Status]
ORDER BY Count DESC
```

**Expected Output:**

| Booking Status       | Count  |
|----------------------|--------|
| Completed            | 93,000 |
| Cancelled by Driver  | 27,000 |
| Cancelled by Customer| 10,500 |
| No Driver Found      | 10,500 |
| Incomplete           |  9,000 |

**Visualization:** Bar chart showing count per booking status.

---

## 2. Vehicle Type Distribution

**Query:** What are the counts of bookings by Vehicle Type?

**Expected SQL:**
```sql
SELECT [Vehicle Type], COUNT(*) AS Count
FROM tbl_ride_bookings
GROUP BY [Vehicle Type]
ORDER BY Count DESC
```

**Expected Output:** A table with each vehicle type and its booking count.

**Visualization:** Pie chart showing proportion of each vehicle type.

---

## 3. Cancellation Reasons

**Query:** What are the most common Driver Cancellation Reason and Incomplete Rides Reason?

**Expected SQL (Driver Cancellation):**
```sql
SELECT [Driver Cancellation Reason], COUNT(*) AS Count
FROM tbl_ride_bookings
WHERE [Driver Cancellation Reason] IS NOT NULL AND [Driver Cancellation Reason] != 'null'
GROUP BY [Driver Cancellation Reason]
ORDER BY Count DESC
```

**Expected SQL (Incomplete Rides):**
```sql
SELECT [Incomplete Rides Reason], COUNT(*) AS Count
FROM tbl_ride_bookings
WHERE [Incomplete Rides Reason] IS NOT NULL AND [Incomplete Rides Reason] != 'null'
GROUP BY [Incomplete Rides Reason]
ORDER BY Count DESC
```

**Expected Output:** A ranked list of the most common driver cancellation reasons and incomplete ride reasons, with counts and/or percentages.

**Visualization:** Horizontal bar chart for each reason category.

---

## 4. Cancellation Proportions

**Query:** What proportion of bookings were cancelled by the customer vs. the driver vs. 'No Driver Found'?

**Expected SQL:**
```sql
SELECT [Booking Status], COUNT(*) AS Count,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tbl_ride_bookings), 2) AS Percentage
FROM tbl_ride_bookings
WHERE [Booking Status] IN ('Cancelled by Customer', 'Cancelled by Driver', 'No Driver Found')
GROUP BY [Booking Status]
ORDER BY Count DESC
```

**Expected Output:**

| Booking Status        | Count  | Percentage |
|-----------------------|--------|------------|
| Cancelled by Driver   | 27,000 | 18.00%     |
| Cancelled by Customer | 10,500 |  7.00%     |
| No Driver Found       | 10,500 |  7.00%     |

**Visualization:** Pie chart or stacked bar showing the proportion of each cancellation type relative to total bookings.

---

## Database Summary

- **Table:** `tbl_ride_bookings`
- **Total rows:** 150,000
- **Key columns:** Booking ID, Date, Time, Booking Status, Customer ID, Vehicle Type, Pickup Location, Drop Location, Avg VTAT, Avg CTAT, Cancelled Rides by Customer, Reason for cancelling by Customer, Cancelled Rides by Driver, Driver Cancellation Reason, Incomplete Rides, Incomplete Rides Reason, Booking Value, Ride Distance, Driver Ratings, Customer Rating, Payment Method

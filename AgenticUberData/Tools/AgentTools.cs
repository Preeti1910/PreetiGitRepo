using System.ComponentModel;
using System.Diagnostics;
using System.Text;
using Microsoft.Data.Sqlite;

public static class AgentTools
{
    // Holds the SQLite connection (assigned at startup)
    public static SqliteConnection DbConnection = null!;

    private static readonly ActivitySource s_activitySource = new("AgenticUberData");

    [Description("Execute a SQL SELECT query on the NCR_Uber_Data database and return results as CSV text. The database has a single table named 'tbl_ride_bookings' with columns: 'Booking ID', 'Date', 'Time', 'Booking Status', 'Customer ID', 'Vehicle Type', 'Pickup Location', 'Drop Location', 'Avg VTAT', 'Avg CTAT', 'Cancelled Rides by Customer', 'Reason for cancelling by Customer', 'Cancelled Rides by Driver', 'Driver Cancellation Reason', 'Incomplete Rides', 'Incomplete Rides Reason', 'Booking Value', 'Ride Distance', 'Driver Ratings', 'Customer Rating', 'Payment Method'.")]
    public static string ExecuteSqlQuery(
        [Description("A SQL SELECT query to run against the tbl_ride_bookings table. Must be a read-only SELECT statement.")] string sql)
    {
        
        // Belt-and-suspenders: explicit replacement for common unicode escapes
        sql = sql.Replace(@"\u0027", "'").Replace(@"\u0022", "\"");

        using var activity = s_activitySource.StartActivity("ExecuteSqlQuery");
        activity?.SetTag("db.system", "sqlite");
        activity?.SetTag("db.statement", sql);

        try
        {
            using var cmd = DbConnection.CreateCommand();
            cmd.CommandText = sql;
            using var reader = cmd.ExecuteReader();

            var output = new StringBuilder();
            int rowCount = 0;
            // Write header row
            for (int i = 0; i < reader.FieldCount; i++)
                output.Append(reader.GetName(i) + (i < reader.FieldCount - 1 ? "," : "\n"));
            // Write data rows
            while (reader.Read())
            {
                rowCount++;
                for (int i = 0; i < reader.FieldCount; i++)
                    output.Append(reader[i]?.ToString() + (i < reader.FieldCount - 1 ? "," : "\n"));
            }

            activity?.SetTag("db.row_count", rowCount);
            activity?.SetStatus(ActivityStatusCode.Ok);
            return output.ToString();
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            return $"SQL Error: {ex.Message}";
        }
    }
}
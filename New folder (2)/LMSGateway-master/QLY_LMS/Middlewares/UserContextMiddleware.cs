using System.Security.Claims;

public class UserContextMiddleware
{
    private readonly RequestDelegate _next;

    public UserContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var claim = context.User.FindFirst("userID");
            if (claim != null)
            {
                context.Items["UserID"] = int.Parse(claim.Value);
            }
        }

        await _next(context);
    }
}

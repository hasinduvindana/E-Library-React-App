namespace Elibrary.Services
{
    using Elibrary.model;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.UI.Services;
    using System.Threading.Tasks;

    public class NullEmailSender : IEmailSender<User>
    {
        // Existing method
        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Task.CompletedTask; // Does nothing
        }

        // Required methods for IEmailSender<User>
        public Task SendConfirmationLinkAsync(User user, string email, string callbackUrl)
        {
            return Task.CompletedTask; // Does nothing
        }

        public Task SendPasswordResetLinkAsync(User user, string email, string callbackUrl)
        {
            return Task.CompletedTask; // Does nothing
        }

        public Task SendPasswordResetCodeAsync(User user, string email, string code)
        {
            return Task.CompletedTask; // Does nothing
        }
    }

}

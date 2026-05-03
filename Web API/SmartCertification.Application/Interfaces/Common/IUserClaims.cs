using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCertification.Application.Interfaces.Common
{
    public interface IUserClaims
    {
        string GetCurrentUserEmail();
        string GetCurrentUserId();
        List<string> GetUserRoles();
        int GetUserId();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace API_Example
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            ShapewaysClient client = new ShapewaysClient(
                "CONSUMER TOKEN",
                "CONSUMER SECRET",
                "http://localhost:49314/Callback.aspx"
            );

            var url = client.connect();
            Session["oauth_token"] = client.OAuthToken;
            Session["oauth_secret"] = client.OAuthSecret;
            Response.Redirect(url);
        }
    }
}

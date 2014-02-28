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
                "1c76f37a9a1d8b5b6b33f5af74ecf323d8e14c2c",
                "059dcb7cb2df148c2ea1edb21f833a38116e76f6",
                "http://localhost:49314/Callback.aspx"
            );

            var url = client.connect();
            Session["oauth_token"] = client.OAuthToken;
            Session["oauth_secret"] = client.OAuthSecret;
            Response.Redirect(url);
        }
    }
}
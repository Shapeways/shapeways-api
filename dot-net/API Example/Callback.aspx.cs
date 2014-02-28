using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace API_Example
{
    public partial class Callback : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["oauth_secret"] == null)
            {
                Response.Redirect("/Login.aspx");
                return;
            }
            ShapewaysClient client = new ShapewaysClient(
                "CONSUMER TOKEN",
                "CONSUMER SECRET",
                "http://localhost:49314/Callback.aspx"
            );
            client.OAuthSecret = Session["oauth_secret"].ToString();
            client.verifyUrl(Request.RawUrl);
            Session["oauth_secret"] = client.OAuthSecret;
            Session["oauth_token"] = client.OAuthToken;
            Response.Redirect("/");
        }
    }
}

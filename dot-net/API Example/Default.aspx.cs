using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace API_Example
{
    public partial class Default : System.Web.UI.Page
    {
        public object apiInfo;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["oauth_secret"] == null || Session["oauth_token"] == null)
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
            client.OAuthToken = Session["oauth_token"].ToString();
            this.apiInfo = client.getApiInfo();
        }
    }
}

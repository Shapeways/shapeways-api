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
                "1c76f37a9a1d8b5b6b33f5af74ecf323d8e14c2c",
                "059dcb7cb2df148c2ea1edb21f833a38116e76f6",
                "http://localhost:49314/Callback.aspx"
            );
            client.OAuthSecret = Session["oauth_secret"].ToString();
            client.OAuthToken = Session["oauth_token"].ToString();
            this.apiInfo = client.getApiInfo();
        }
    }
}
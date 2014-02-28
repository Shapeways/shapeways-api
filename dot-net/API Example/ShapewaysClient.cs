using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Web;
using OAuth;
using Newtonsoft.Json;

namespace API_Example
{
    public class ShapewaysClient
    {
        private String consumerKey, consumerSecret, callback;
        public String OAuthToken, OAuthSecret;

        public ShapewaysClient(String consumerKey, String consumerSecret, String callback = "oob"){
            this.consumerKey = consumerKey;
            this.consumerSecret = consumerSecret;
            this.callback = callback;
        }

        public String connect()
        {
            OAuthRequest client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.RequestToken,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = this.consumerKey,
                ConsumerSecret = this.consumerSecret,
                RequestUrl = "https://api.shapeways.com/oauth1/request_token/v1",
                Version = "1.0a",
                Realm = "shapeways.com",
                CallbackUrl = this.callback,
            };
            string auth = client.GetAuthorizationQuery();
            string url = client.RequestUrl + "?" + auth;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string content = new StreamReader(response.GetResponseStream()).ReadToEnd();
            var result = HttpUtility.ParseQueryString(content);
            var authUrl = result.Get("authentication_url");
            this.OAuthToken = result.Get("oauth_token");
            this.OAuthSecret = result.Get("oauth_token_secret");
            response.Close();
            return authUrl;
        }

        public void verifyUrl(string url)
        {
            var qsParams = HttpUtility.ParseQueryString(url);
            var token = qsParams.Get("oauth_token");
            var verifier = qsParams.Get("oauth_verifier");
            OAuthRequest client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.AccessToken,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = this.consumerKey,
                ConsumerSecret = this.consumerSecret,
                RequestUrl = "https://api.shapeways.com/oauth1/access_token/v1",
                Version = "1.0a",
                Realm = "shapeways.com",
                TokenSecret = this.OAuthSecret,
                Token = token,
                Verifier = verifier,
            };
            string auth = client.GetAuthorizationQuery();
            string requestUrl = client.RequestUrl + "?" + auth;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string content = new StreamReader(response.GetResponseStream()).ReadToEnd();
            var result = HttpUtility.ParseQueryString(content);
            this.OAuthToken = result.Get("oauth_token");
            this.OAuthSecret = result.Get("oauth_token_secret");
        }

        public object getApiInfo()
        {
            OAuthRequest client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.ProtectedResource,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = this.consumerKey,
                ConsumerSecret = this.consumerSecret,
                RequestUrl = "https://api.shapeways.com/api/v1",
                Version = "1.0a",
                Realm = "shapeways.com",
                TokenSecret = this.OAuthSecret,
                Token = this.OAuthToken,
            };
            string auth = client.GetAuthorizationQuery();
            string requestUrl = client.RequestUrl + "?" + auth;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string content = new StreamReader(response.GetResponseStream()).ReadToEnd();
            return JsonConvert.DeserializeObject(content);
        }

    }
}
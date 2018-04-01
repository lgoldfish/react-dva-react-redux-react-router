export async function getRequest(url, params) {
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key =>
      paramsArray.push(key + "=" + params[key])
    );
    if (url.search(/\?/) === -1) {
      url += "?" + paramsArray.join("&");
    } else {
      url += "&" + paramsArray.join("&");
    }
  }
  return await fetch(url, {
    method: "get",
    params: params
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      return json;
    })
    .catch(function(ex) {
      console.log("parsing failed", ex);
    });
}
export async function postRequest(url,data){
  return await fetch(url,{
    method:"POST",
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data)
  })
}

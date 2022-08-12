## URL
### login
  Method : post
  request parameter : {email : '', password : ''}
  request Url : http://localhost:8800/api/user/signin, http://localhost:8800/api/admin/signin
  response : { value = {/*실제 데이터 */}, code = "" this.msg = "" }
### signup
  Method : put
  request parameter : {email : '', password : '', name : '', phone : ''}
  request Url : http://localhost:8800/api/user/signup
  response : { value = {/*실제 데이터 */}, code = "" this.msg = "" }
### findId
  Method : get
  request parameter : {phone : ''}
  request Url : http://localhost:8800/api/user/findId
  response : { value = {/*실제 데이터 */}, code = "" this.msg = "" }
### findPassword
  Method : get
  request parameter : {email : ''}
  request Url : http://localhost:8800/api/user/findPassword
  response : { value = {/*실제 데이터 */}, code = "" this.msg = "" }

## TEST DATA
### password
  85189c34f5df35582de4ea2208bbda6efc5cde8e0b3c2fc6422a64f4d657bd74 => 1234qwer!

### Wallet
  admin 
    privateKey : E6338E64B7BDA38763A2B84A327A02B61D2610E5FF986EC6C3F30129461A9200
    publicKet : 04CA0D075293680CFC7D3FFEF20E7720FD71C06E40CF118CCB9EF3DB5886AE3ABFF34B9210BA3B7BA4BC48519CB88BFE08F4C56EBCC6A507622F03B320EF3E827B
    address {
      base58 : TTCn7Brdc41eGEPxUAN9NvmymRad5tTeR5
      hex : 41BD0B2E5959E3E304B2801897517F344BA3540F16
    }
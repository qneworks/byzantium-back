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


### trans
  Method : get
  request parameter : {start : '', end : '', searchkey : '', searchvalue : '', page : '', limit : ''}
  request Url : http://localhost:8800/api/admin/trans
  response : { value = {/*실제 데이터 */}, code = "" this.msg = "" }

## TEST DATA
### password
  85189c34f5df35582de4ea2208bbda6efc5cde8e0b3c2fc6422a64f4d657bd74 => 1234qwer!

### Wallet
  
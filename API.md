# Api Documentation


- [Api Documentation](#api-documentation)
	- [login](#login)
		- [POST](#post)
			- [Request](#request)
			- [Returns](#returns)
	- [signup](#signup)
		- [POST](#post-1)
			- [Request](#request-1)
			- [Returns](#returns-1)


## login
### POST
#### Request

edit this to be correct to our project or link swaggerhub or something

login - Username of the user logging in \
pass - Password of the user logging in
```json 
{
	"username": string,
	"password": string
}

```
#### Returns

edit this to be correct to our project or link swaggerhub or something

json body \
error should usually be empty
```json 
{
	"id": int,
	"firstname": string,
	"lastname": string,
	"error": string
}

```

<br>

## signup
### POST
#### Request

edit this to be correct to our project or link swaggerhub or something

```json 
{
	"FirstName": string,
	"LastName": string,
	"Username": string,
	"Password": string
}

```
#### Returns

edit this to be correct to our project or link swaggerhub or something

Empty error string
```json
{
	"error": ""
}
```
  
<br>


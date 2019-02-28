# Status Code

### HTTP Status Code

Here we only use 7 HTTP status codes from over 70 of them.

- **200** For any successful and legal request.

- **201** For legal resource request based on multiple handshaking.

- **304** For GET request when resource unmodified.

- **400** Bad request.

- **401** Illegal WWW-Authenticate header field.

- 🕲

- **500** Service or resources unavailable.


### Customized Status Code

List of verbose information status code issued for response and log files.

Code number starts at 6 to avoid confusion with HTTP status code.

#### First \#

- **6xx** (Informational): Multiple handshaking request received, continuing process.
- **7xx** (Operation Successful): The request was successfully received and processed.
- **8xx** (Request Error): The request contains illegal fields or syntax.
- **9xx** (Service Error): Random service crushed or unable to fulfill requesting.

#### Second \#

- **x1x** (Server Level): Service and configuration operation status.
- **x2x** (User Level): User operation status.
- **x3x** (Transaction Level): Transaction operation status.

#### Third \#

Depending on specific circumstances.

#### Details

##### 7xx Success

- **711** Service in progress.
- **712** Database connected.
- **713** Global data fetched.
- **714** Global data persisted into disk.
- **721** User Signed up.
- **722** User logged in.
- **723** User account information fetched.
- **724** User logged out.
- **725** User still alive (for heartbeat query).
- **731** Transaction pool information fetched.
- **732** Transactions purchased.
- **733** Transactions deliveried.

##### 8xx Illegal request

- **811** Invalid session ID (for fetching global data).
- **812** Global data persistence failed.
- **813** 
- **821** Account name already been in use.
- **822** Password not strong enough.
- **823** Account name does not exist.
- **824** Incorrect password.
- **825** Illegal session ID (for account info).
- **826** User dead (for heartbeat query).
- **827** 

##### 9xx Service fault

- **911** Server port already been in use.
- **912** Database connection failed.
- **913** 
- **914**

EOF
 # Issues & Updates

### Issues
- Security/Authentication.
	Administration password needed for global data request.
	Cookie, authentication token, or backend-generated sessionId for user recognition.

- Performance management.
	Can express backend service handle C10K/C100K problem alone?
  
- Essential optimization.
	We need to cut down potential stupid data processing logics :P

### Updates
- 2019.3.5 Add customized status code.
	For the corresponding information in different situations.
  
- 2019.3.5 Add tx verification handler.
	For transaction validation before purchasement to avoid request failure invoked by data inconsistency.
  
- 2019.3.6 Add password strength verification.
	Three strength levels to set and default is moderate.
  
- 2019.3.6 Modify transaction data structure.
	Add *power*, *timestampExpire* fields.

EOF
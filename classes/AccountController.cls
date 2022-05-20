public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        List<Account> accounts = [
            SELECT Id, Name, Rating
            FROM Account
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 10 
        ];
        if (accounts.isEmpty()) {
            throw newMessageException('Accounts are empty');
        }
        return accounts;
    }

    private static AuraHandledException newMessageException(String message) {
        AuraHandledException auraException = new AuraHandledException(message);
        auraException.setMessage(message);
        return auraException;
    }
}

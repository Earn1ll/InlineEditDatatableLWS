@IsTest
public with sharing class AccountControllerTest {

    @testSetup
    static void setup() {
        List<Account> testAccounts = new List<Account>();
        for(Integer i = 0; i < 3; i++) {
            testAccounts.add(new Account(Name = 'testAccount' + 1));
        }
    insert testAccounts;
    }

    @isTest 
    static void getAccounts_returnAccounts_accountsWasReceived() {
        List<Account> newAccounts = [SELECT Id, Name, Rating FROM Account];

        Test.startTest();
        List<Account> returnedAccounts = AccountController.getAccounts();
        Test.stopTest();

        System.assertEquals(newAccounts, returnedAccounts, 'Accounts were not received');
    }

    @isTest 
    static void getAccounts_returnAccounts_errorTrown() {
        List<Account> allAccounts = [SELECT Id FROM Account];
        delete allAccounts;

        Test.startTest();
        Boolean isException = false;
        try {
            AccountController.getAccounts();
        } catch (Exception e) {
            if (e.getMessage().contains('Accounts are empty')) {
                isException = true;
            }
        }
        Test.stopTest();

        System.assert(isException, 'Account should have thrown an exception');
    }
}
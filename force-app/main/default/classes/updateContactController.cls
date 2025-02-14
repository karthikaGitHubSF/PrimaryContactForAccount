public with sharing class updateContactController {
    @Auraenabled
    public static String updateRec(String recordId,List<Contact> conList)
    {
        List<Contact> contactsToUpdate = new List<Contact>();

        for (Contact con : conList) {
            if (con.Id == recordId) {
                con.IsPrimary__c = true;
            } else {
                con.IsPrimary__c = false;
            }
            contactsToUpdate.add(con);
        }
    
        try {
            update contactsToUpdate;
            return 'Success';
        } catch (Exception e) {
            return 'Error: ' + e.getMessage();
        }
    }
}
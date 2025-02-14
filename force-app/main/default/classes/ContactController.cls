public with sharing class ContactController {
    @Auraenabled
    public static String insertRecord(String lastName, String MobilePhone,String AccountId) {

        try {
            
        Contact con=new Contact();
        con.AccountId=AccountId;
        con.LastName=lastName;
        con.MobilePhone=MobilePhone;
        insert con;
        return con.Id;
    }
        catch (Exception e){
            throw new AuraHandledException('Error inserting contact: ' + e.getMessage());
     }

    }

    
}
public with sharing class RelatedContactController {
   
    @Auraenabled(cacheable=true)
    public static List<Contact> getRelatedContact(String AccountId) {
                    
    List<Contact> conList =  [SELECT Id,LastName,IsPrimary__c From Contact 
                              where AccountId =:AccountId 
                            ];
                            
    if(!conList.isEmpty())
    {   
        return conList;
    }
    else
    {
        return new List<Contact>();
    }
    }

    
}
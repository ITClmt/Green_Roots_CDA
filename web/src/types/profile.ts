/**
les intearfaces devront etre mise a jours lors de l'implémentation de la bdd
 */
export interface UserProfile {
  id: string;
  firstName: string; 
  lastName: string;  
  treesPlanted: number;
}


export interface BadgeData {
  id: string;
  name: string;
  description: string;
  variant: 'green' | 'brown'; 
}


export interface OrderData {
  id: string;          
  name: string;        
  quantity: number;    
  createdAt: string;   
  location: string;    
  iconVariant: 'pine' | 'sprout' | 'leaf'; 
}

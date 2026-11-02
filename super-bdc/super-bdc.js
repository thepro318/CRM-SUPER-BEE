// Super BDC prototype: no network calls, secrets, or real customer data.
const message=(from,text,at='Demo history')=>({from,text,at});
export const mockLeads=[
{id:'DEMO-1001',name:'Jordan Brooks',vehicle:'2021 Toyota Camry',source:'Website',intent:'financing',channel:'sms',consent:true,optOut:false,temperature:'Hot',messages:[message('dealer','Thanks for your interest!'),message('customer','Can I finance with a small down payment?')]},
{id:'DEMO-1002',name:'Taylor Morgan',vehicle:'2019 Honda Accord',source:'Facebook',intent:'appointment',channel:'sms',consent:true,optOut:false,temperature:'Hot',messages:[message('customer','Can I come look at it this Saturday?')]},
{id:'DEMO-1003',name:'Casey Rivera',vehicle:'2020 Ford Escape',source:'CarGurus',intent:'price',channel:'email',consent:true,optOut:false,temperature:'Warm',messages:[message('customer','Is the advertised price your best price?')]},
{id:'DEMO-1004',name:'Alex Parker',vehicle:'2022 Nissan Altima',source:'Website',intent:'trade',channel:'sms',consent:true,optOut:false,temperature:'Warm',messages:[message('customer','Do you take trade-ins?')]},
{id:'DEMO-1005',name:'Morgan Ellis',vehicle:'2018 Toyota RAV4',source:'Facebook',intent:'browsing',channel:'sms',consent:true,optOut:false,temperature:'Cold',messages:[message('customer','Just looking for now.')]},
{id:'DEMO-1006',name:'Drew Bailey',vehicle:'2017 Ford F-150',source:'Marketplace',intent:'optout',channel:'sms',consent:false,optOut:true,temperature:'Cold',messages:[message('customer','STOP. Do not text me again.')]},
{id:'DEMO-1007',name:'Riley Bennett',vehicle:'2021 Kia Forte',source:'Credit Acceptance',intent:'financing',channel:'email',consent:true,optOut:false,temperature:'Hot',messages:[message('customer','What do I need to bring to apply?')]},
{id:'DEMO-1008',name:'Sam Carter',vehicle:'2020 GMC Terrain',source:'Website',intent:'availability',channel:'sms',consent:true,optOut:false,temperature:'Warm',messages:[message('customer','Is that SUV still available?')]},
{id:'DEMO-1009',name:'Jamie Stone',vehicle:'2016 Chevrolet Silverado',source:'Facebook',intent:'hesitant',channel:'sms',consent:true,optOut:false,temperature:'Warm',messages:[message('customer','Not sure I want to drive over there yet.')]},
{id:'DEMO-1010',name:'Avery Reed',vehicle:'2022 Hyundai Elantra',source:'CarGurus',intent:'followup',channel:'email',consent:true,optOut:false,temperature:'Cold',messages:[message('customer','I will think about it.')]}];
export function classify(lead){if(lead.optOut)return 'Do Not Contact';return ['Hot','Warm','Cold'].includes(lead.temperature)?lead.temperature:'Cold'}
export function checkOutbound(lead){if(lead.optOut)return {allowed:false,reason:'Do not contact: opt-out is present.'};if(!lead.consent)return {allowed:false,reason:'Consent unverified. No outreach allowed.'};return {allowed:false,reason:'Outbound text and email transmission is disabled for this prototype.'}}
const responses={
 financing:"Absolutely, we can review financing options. Is keeping the down payment low or finding a comfortable monthly payment more important to you?",
 appointment:"I'd be happy to help you plan a visit. What time on Saturday would work best? I'll verify an available appointment slot before confirming.",
 price:"Thanks for asking! I can help you review the pricing and available options. Are you planning to finance or pay cash? I'll have a team member verify any final figures.",
 trade:"We do consider trade-ins! What year, make, model, and approximate mileage is your current vehicle?",
 browsing:"No problem! What would you want to improve about your current vehicle when you're ready to make a change?",
 optout:"",
 availability:"Thanks for checking! Let me confirm the vehicle's current availability before giving you an answer. Is there a time you would prefer to come see it if available?",
 hesitant:"That makes sense. What would you want to know before making the trip—vehicle details, financing, or something else?",
 followup:"Thanks for considering us. Is there any information I can clarify to help with your decision?"
};
export function generateDraft(lead,channel='sms'){if(lead.optOut||!lead.consent)return 'DRAFT BLOCKED — contact is opted out or consent is unverified.';const intro='Hi '+lead.name.split(' ')[0]+', this is the sales team at Vic Garrett Motors. ';const body=responses[lead.intent]||'What can I help you with regarding your vehicle search?';return (channel==='email'?'Subject: Your vehicle inquiry at Vic Garrett Motors\n\n':'')+intro+body+(channel==='email'?'\n\nVic Garrett Motors':'')}
const disabled=operation=>{throw new Error('DEALERSOCKET_DISABLED: '+operation+' requires dealership approval and authorized integration.')};
export const dealerSocketAdapter=Object.freeze({
 capabilities:()=>({connected:false,mode:'disabled',leadRead:false,conversationRead:false,noteWrite:false,appointmentWrite:false,outboundMessaging:false}),
 listLeads:()=>disabled('listLeads'),
 getConversation:()=>disabled('getConversation'),
 createNote:()=>disabled('createNote'),
 createAppointment:()=>disabled('createAppointment'),
 sendMessage:()=>disabled('sendMessage')
});
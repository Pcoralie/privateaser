'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];



console.log(bars);
console.log(events);
console.log(actors);

//Step 1 : Euro-People
// Booking price = time component + people component
// time component : the number of booked time multiplied by the bar price per hour
// people component : the number of persons multiplied by the bar price per person
function step1(){
  for(let e = 0 ; e < events.length ; e++){
    for(let b = 0 ; b < bars.length ; b++){
        if( events[e].barId == bars[b].id){
            events[e].price =  events[e].time * bars[b].pricePerHour + events[e].persons* bars[b].pricePerPerson;
        }
    }
  }
}

// Step 2 : Send more, pay less
function step2(){
  for(let e = 0 ; e < events.length ; e++){
    for(let b = 0 ; b < bars.length ; b++){
        if( events[e].barId == bars[b].id){

          // price per people decreases by 10% after 10 persons
          if( events[e].persons > 10 && events[e].persons <= 20){
            events[e].price =  events[e].time * bars[b].pricePerHour + events[e].persons*(bars[b].pricePerPerson* ( 1- (10/100)));
          }

          // price per people decreases by 30% after 20 persons
          if( events[e].persons > 20 && events[e].persons <= 60){
            events[e].price =  events[e].time * bars[b].pricePerHour + events[e].persons*(bars[b].pricePerPerson* ( 1- (30/100)));
          }

          //price per people decreases by 50% after 60 persons
          if( events[e].persons > 60){
            events[e].price =  events[e].time * bars[b].pricePerHour + events[e].persons*(bars[b].pricePerPerson* ( 1- (50/100)));
          }
        }
      }
  }
}


// Step 3 : Give me all your money
function step3(){
  for( let e = 0; e<events.length; e++){

    //There is a 30% commission on the booking price to cover the costs
    var commission = events[e].price * 0.3;

    // insurance have the half of commission
    var insurance = commission / 2 ;

    //Treasury : 1 euro by person
    var treasury = 1* events[e].persons;

    //Privateaser : the rest of the commission
    // rest = commission - insurance - treasury
    var privateaser = commission - insurance - treasury;

    // We affect the amount :
    events[e].commission.insurance = insurance;
    events[e].commission.treasury = treasury;
    events[e].commission.privateaser= privateaser;
   }
}

//Step 4 : The famous deductible
// If the booker chooses the deductible reduction option, he is charged an additional 1euro/person
function step4(){
  for (let e = 0; e<events.length ; e++){
    if(events[e].options.deductibleReduction == true){
      events[e].price = events[e].price + 1*events[e].persons;
    }
  }
}


//Step 5 : Pay the actors
function step5(){
  for(let a = 0 ; a < actors.length ; a++){
    for( let e = 0 ; e< events.length ; e++){
      if( events[e].id == actors[a].eventId){
        for(let p = 0 ; p < actors[a].payment.length ; p ++){

          //The booker must pay the booking price and the (optional) deducticle reduction
          // It is also the price calculated in the step 4
              if(actors[a].payment[p].who == "booker"){
                  actors[a].payment[p].amount = events[e].price;
              }

         //The bar receives the booking price minus the commission
              if(actors[a].payment[p].who == "bar"){
                var bookingPrice = events[e].price;
                if(events[e].options.deductibleReduction == true){
                    bookingPrice = events[e].price - 1*events[e].persons;
                }
                actors[a].payment[p].amount = bookingPrice - 0.3*bookingPrice ;
              }

          //The insurance receives its part of the commission
              if(actors[a].payment[p].who == "insurance"){
                  actors[a].payment[p].amount = events[e].commission.insurance;
              }

          // The treasury receives its part of the tax commission
              if(actors[a].payment[p].who == "treasury"){
                  actors[a].payment[p].amount = events[e].commission.treasury;
              }

          //Privateaser receives its part of the commission, plus the deductible reduction
              if(actors[a].payment[p].who == "privateaser"){
                var deductibleReduction = 0;
                if(events[e].options.deductibleReduction == true){
                  deductibleReduction = 1*events[e].persons;
                }
                actors[a].payment[p].amount = events[e].commission.privateaser + deductibleReduction;
              }
        }
      }
    }
  }
}


step1();
step2();
step3();
step4();
step5();

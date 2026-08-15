import { EventCard } from '../types/game';

export const EVENTS: EventCard[] = [
  {
    id: 'council_of_jerusalem',
    name: 'The Council of Jerusalem',
    desc: 'A fierce theological dispute erupts over whether Gentile believers must be circumcised before entering the covenant.',
    mechanic: 'Group Choice: Concede (All living take +1 Pride) OR Debate (Antioch locked for 1 round). Paul Override available.',
  },
  {
    id: 'simon_magus',
    name: "Simon the Sorcerer's Offer",
    desc: 'A wealthy magician sees the Spirit moving with wonders and offers large sums of silver to buy the power for himself.',
    mechanic: 'Individual Choice: Accept (-1 Crown, +1 Seed locally, +1 Pride) OR Refuse (No effect). Peter can veto.',
  },
  {
    id: 'ephesian_riot',
    name: 'The Ephesian Riot',
    desc: 'Demetrius the silversmith stirs up the pagan guild. A furious mob rushes the great theater chanting "Great is Artemis!"',
    mechanic: 'Asia Minor loses all Seeds; stationed Apostles take +2 Heat. John can absorb mob (+4 Heat, seeds spared).',
  },
  {
    id: 'euroclydon_shipwreck',
    name: 'Shipwrecked by the Euroclydon',
    desc: 'A tempestuous northeaster winds strike the shipping vessels. Navigation is lost and all travel is shattered.',
    mechanic: 'All living Apostles are scattered to random regions across the Mediterranean. Thomas is immune.',
  },
  {
    id: 'care_of_churches',
    name: 'The Care of the Churches',
    desc: 'The unrelenting burden, pastoral letters, and spiritual warfare threaten exhaustion and burnout among leadership.',
    mechanic: 'Individual Choice: Rest (Skip next turn) OR Push Through (+1 Pride). Andrew can absorb another brother\'s Pride.',
  },
  {
    id: 'nero_blame',
    name: "Nero's Blame",
    desc: 'The Emperor seeks a scapegoat for the Great Fire of Rome and turns imperial cohorts onto the assemblies of believers.',
    mechanic: 'Global Persecution Track drops by 2. Choose: Hide (Skip next turn) OR Defy (+2 Heat). James can absorb the fire (+4 Heat).',
  },
  {
    id: 'judean_famine',
    name: 'Famine in Judea',
    desc: 'A crippling drought and grain shortage sweep through Judea. The saints are starving and funds are scarce.',
    mechanic: 'Individual Choice: Feed Saints (-1 Crown) OR Feed Yourself (+1 Pride).',
  },
  {
    id: 'macedonian_call',
    name: 'The Macedonian Call',
    desc: 'A vision appears in the night: "Come over to Macedonia and help us." The Lord directs missionary sails to new shores.',
    mechanic: 'The Spirit prepares the harvest field. Greece receives +2 Seeds automatically.',
  },
  {
    id: 'pax_romana',
    name: 'Pax Romana',
    desc: 'A temporary imperial armistice brings calm to the provinces, allowing peaceful travel along Roman roads.',
    mechanic: 'Global Persecution Track increases by 1. Choose: Sabbatical (-1 Pride, Skip Turn) OR Evangelize (+1 Heat, +1 Seed).',
  },
  {
    id: 'the_judaizers',
    name: 'The Judaizers',
    desc: 'Legalistic agitators infiltrate the congregations, distorting grace and demanding legalistic rituals.',
    mechanic: 'The region with the most seeds loses 1 Seed. Paul can write Galatians (+1 Pride to Paul, 0 seeds lost).',
  },
];

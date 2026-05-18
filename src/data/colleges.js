// ─── How to add your content ────────────────────────────────────────────────
//
// TEXT
//   Fill in `description` and `notableFigure.bio` directly below.
//
// IMAGES
//   1. Drop your image files into src/assets/colleges/
//        e.g. src/assets/colleges/smith.jpg
//   2. Import them at the top of this file:
//        import smithImg from '../assets/colleges/smith.jpg'
//   3. Set  image: smithImg  in the matching college object.
//
// ────────────────────────────────────────────────────────────────────────────

// ─── How to add logos ───────────────────────────────────────────────────────
//
//   1. Drop the logo file into src/assets/colleges/
//        e.g. src/assets/colleges/smith-logo.png
//   2. Import it at the top of this file:
//        import smithLogo from '../assets/colleges/smith-logo.png'
//   3. Set  logo: smithLogo  in the matching college object.
//
// ────────────────────────────────────────────────────────────────────────────
import zoraImg from '../assets/colleges/zora-neale-hurston.jpg'
// import radcliffeNewspaper from '../assets/colleges/radcliffe-newspaper.jpg'
import marthaImg from '../assets/colleges/martha-carey-thomas.jpg'
import francesImg from '../assets/colleges/frances-perkins.jpg'
import helenImg from '../assets/colleges/helen-keller.jpg'
import gloriaImg from '../assets/colleges/gloria-steinem.jpg'
import hilaryImg from '../assets/colleges/hilary-clinton.jpg'
import ednaImg from '../assets/colleges/edna-st-vincent-millay.jpg'

import radcliffepaperImg from '../assets/colleges/radcliffe-paper.jpg'

export const COLLEGES = [
  {
    name: 'Mount Holyoke',
    lngLat: [-72.5764, 42.2551],
    logo: null,
    motto: '<<That our daughters may be as corner stones,\npolished after the similitude of a palace>>\n(Psalm 144:12)',
    description: 'Mount Holyoke college is the oldest of the seven sister colleges, founded in 1837 by Mary Lyon in South Hadley Massachusetts. The college advocates for ideals of the collective rather than the individualism that capitalist and patriarchal society promotes.\n\nIn 2014 it was the first women`s college in the United States to accept all trans women and nonbinary applications. And while the college was originally an all women school—and the undergraduate program remains that way—now, any person of any gender may study in the graduate program of the college.',
    notableFigure: {
      name: 'Frances Perkins',
      image: francesImg,
      bio: 'Frances Perkins attened Mount Holyoke and graduated in 1902 with a degree in chemistry and physics. In 1933, she became the secretary of labor under Roosevelt and consequently the first women ever to be in the US presidential cabinet. She once said that Florence Kelley`s speech at Mount Holyoke, “First opened my mind to the necessity for and the possibility of the work which became my vocation” (Frances Perkins Center).\n\nShe contunied working for Labor reforms and later in a radio transmission during the Great Depression she said, "We cannot be satisfied merely with makeshift arrangements which will tide us over the present emergencies. We must devise plans that will not merely alleviate the ills of today, but will prevent, as far as it is humanly possible to do so, their recurrence in the future" (Frances Perkins Center).',
    },
  },
  {
    name: 'Smith',
    lngLat: [-72.6382, 42.3189],
    logo: null,
    motto: '<<Ἐν τῇ ἀρετῇ τὴν γνῶσιν>>\n(To Virtue, Knowledge)',
    description: 'Smith College was founded in 1871 via a bequest from Sophia Smith and opened in 1875.  It has an open curriculum focus, was the first women`s college to have an undergraduate degree in engineering and the first women`s college to join the NCAA.\n\nSmith also boasts a unique layout. As Helen Lefkowitz Horowitz says in //Alma Mater: Design and Experience in the Women`s Colleges// (1993), “Built in a town, rather than as Wellesley or Vassar on a country estate, Smith did not have a single seminary building, but rather a variety of buildings for different uses. Students lived in "cottages," structures designed inside and out to look like family dwellings. Smith broke the seminary`s disciplinary code and disposed of the structure of rules monitored by female faculty; as in a family, students lived by informal and unwritten rules” (Horowitz 34).\n\nIn 2010, Smith College earned the title of the largest women`s college in the United States with over 2,000 undergraduate students. It has retained that title and only grown in size since.',
    notableFigure: {
      name: 'Gloria Steinem',
      image: gloriaImg,
      bio: 'Gloria Steinem studied goverment at Smith graduating in 1956. She was a feminist activist who co-founded the Women`s Action Alliance. Althoguh Smith did provide a lot of helpful oppurtunities she faced challenges there as a women saying in a speech at Vassar college in 1970, "I don`t know about Vassar, but at Smith we learned almost nothing about women. We believed, for instance, that the vote had been “given” to women in some whimsical, benevolent fashion. We never learned about the long desperation of women`s struggle, or about the strength and wisdom of the women who led it. We heard about the men who risked their lives in the Abolitionist Movement, but seldom about the women; even though women, as in many movements of social reform, had played the major role. We knew a great deal more about the outdated, male-supremacist theories of Sigmund Freud than we did about societies in which women had equal responsibility, or even ruled." (Steinem par. 12).',
    },
  },
  {
    name: 'Wellesley',
    lngLat: [-71.3065, 42.2951],
    logo: null,
    motto: '<<Non Ministrari sed Ministrare>>\n(Not to be ministered unto, but to minister)',
    description: 'Wellesley College was founded by Pauline and Henry Fowle Durant, originally named the “Wellesley Female Seminary” until the name was changed in 1873. Unlike many other “all women” colleges Wessesley has never had a male president over its 150 year long lifetime.\n\nRanked at #7 in liberal arts colleges nationwide, Wellesley focuses on educating women who would create the next breakthroughs in their given fields, and be ready to lead in the world and it has lived up to those same standards and continues to produce those results today.',
    notableFigure: {
      name: 'Hilary Clinton',
      image: hilaryImg,
      bio: 'Majoring in Politcal Science, Hilary Clinton graduated from Wellesley in 1969. Likely the most well known figures to come out of Wellesley, Clinton has had a large career in politics. She served as the senator of both New York and Arkansas and was the secretary of state under Obama. Her jorney was somewhat acredited to Wellesly, the year she graduated (1969) saying , "So we arrived at Wessely and we found, as all of us had found, that there was a gap between expectation and realities. But it wasn`t a discouraging gap and it didn`t turn us into cynical, bitter old women at the age of 18. It just inspired us to do something about that gap” (Clinton`s Student Speech 2:19) She would later speak at Beijing in 1995 popularizing the iconic "women`s rights are human rights" phrase.',
    },
  },
  {
    name: 'Radcliffe',
    lngLat: [-71.1223, 42.3758],
    logo: null,
    motto: '<<Veritas>>\n(Truth)',
    description: `Radcliffe College, located in Cambridge Massachusetts, was founded as a women\`s college in 1879. Originally named, “The Harvard Annex” it emerged from a fight for women to be able to earn degrees at a Harvard level. As Barabara Miller Solomon writes in //A history of women and higher education in America// (1985), “The undaunted determination of Mrs. Agassiz and her friends at the university brought the chartering of Radcliffe College in 1894 as a degree-granting institution to offer the equivalent of a Harvard degree; the corporation, though unwilling to give women its A.B., agreed to serve as 'Visitors' and to let Harvard's president countersign Radcliffe diplomas” (Solomon 55).\n\nIn 1999, just 27 years ago, Radcliffe officially merged with Harvard allowing women to get complete degrees and take full advantage of Hardvard\`s resources.`,
    extras: [
      {
        title: 'Radcliffe Song',
        text: 'Oh Wellesley has a campus to wake the muses\' lyre\n\nThe beauties of Northampton a poet could inspire;\n\nAnd spring is sweet at Vassar when trees are in the bud\n\nBut I sing of Radcliffe College in the midst of Cambridge mud.',
      },
      {
        title: 'Newspaper Clipping',
        image: radcliffepaperImg,
        text: '',
      },
    ],
    notableFigure: {
      name: 'Helen Keller',
      image: helenImg,
      bio: 'Helen Keller is widely known as a deaf-blind women who was able to learn to communicate and strongly advocate for herself and others. Few know, however, that she also attened and graudated from Radcliffe College. Despite her triumphs and abilities she faced many discrimations in her educational life, writing, “The college authorities would not permit Miss Sullivan to read  the examination papers to me; so Mr. Eugene C. Vining, one of the  instructors at the Perkins Institution for the Blind, was  employed to copy the papers for me in braille. Mr. Vining was a  perfect stranger to me, and could not communicate with me except  by writing in braille. The Proctor also was a stranger, and did  not attempt to communicate with me in any way; and, as they were  both unfamiliar with my speech, they could not readily understand what I said to them” (Letter to Mr. John Hitz).',
    },
  },
  {
    name: 'Vassar',
    lngLat: [-73.8957, 41.6870],
    logo: null,
    motto: '<<Purity and Wisdom>>',
    description: 'Vassar college was founded as a women`s college in 1861 by Matthew Vassar in Poughkeepsie, New York. Vassar brought both incredible and (at the time) unique opportunities for women. Author Helen Lefkowitz Horowitz says in her book //Alma Mater: Design and Experience in the Women`s Colleges// (1993), “In 1865, when the first women came to Vassar College, they entered a community that differed from that of any college for men. As a true college, Vassar offered to women the full liberal arts curriculum, including the study of the ancient languages, taught by a faculty of professorial grade.” (Horowitz 180)\n\nIn 1969, Vassar became the first of Seven Sisters college to become co-educational.',
    notableFigure: {
      name: 'Edna St. Vincent Millay',
      image: ednaImg,
      bio: 'Edna St. Vincent Millay was a poet and playwright who attended and then graduated from Vassar College in 1917. She wasn`t the typical student at Vassar. In fact, she regularly skipped class and was known for rebelling against the rules of the college. Her poetry refelcts this nature and tends to talk about freedom and women`s choice in all areas of life. In 1923 she wrote, //"I, being born a woman and distressed."//',
    },
    notableExtras: [
      {
        title: 'Poem',
        text: 'I, being born a woman and distressed\nBy all the needs and notions of my kind,\nAm urged by your propinquity to find\nYour person fair, and feel a certain zest\nTo bear your body`s weight upon my breast:\nSo subtly is the fume of life designed,\nTo clarify the pulse and cloud the mind,\nAnd leave me once again undone, possessed.\nThink not for this, however, the poor treason\nOf my stout blood against my staggering brain,\nI shall remember you with love, or season\nMy scorn with pity,—let me make it plain:\nI find this frenzy insufficient reason\nFor conversation when we meet again.',
      },
    ],
  },
  {
    name: 'Barnard',
    lngLat: [-73.9634, 40.8090],
    logo: null,
    motto: '<<Ἑπομένη τῷ λογισμῷ>>\n(Following the way of reason)',
    description: 'Barnard College was founded by Annie Nathan Meyer and a group of young women looking to broaden their educational prospects in 1989. They pushed Columbia to build an affiliated college that accepted women and named it after the president of the University who had been advocating for women`s education for the majority of his impressive 25 year long term. //In A History of Women and Higher Education in America// (1985) Barabara Miller Solomon says, “[Barnard`s] academic status, like that of Radcliffe, derived from its connection with a prestigious male institution. But over the years one essential difference developed in that Barnard gained the right to recruit its own faculty. Radcliffe women were not awarded Harvard A.B.s until 1965, and the first women undergraduates were not admitted to Columbia until 1983; but Barnard still maintained a separate existence” (Solomon 54)\n\nNow, in 2026, Barnard College puts an emphasis on the importance of student voices in the community, encouraging each student to find their own voice through the Collective Advocacy Project. The school is also now independent from Columbia in almost all aspects aside from combined sports teams.',
    notableFigure: {
      name: 'Zora Neale Hurston',
      image: zoraImg,
      bio: 'Although there were, of course, many great aspects of these colleges they still suffered from the same racism and classism that was so prevalent at the time. Zora Neale Hurston was a student at Barnard College in the 1920s and was one of the only Black students at the school. In her essay //How it Feels to Be Colored Me// (1928) she writes, “For instance at Barnard. `Beside the waters of the Hudson` I feel my race. Among the thousand white persons, I am a dark rock surged upon, and overswept, but through it all, I remain myself. When covered by the waters, I am; and the ebb but reveals me again” (How It Feels to Be Colored Me par. 10). After graduating from Barnard, Hurston became a promient auther and activist in the Harlem Renaissance, writing essays and 50+ short storys.',
    },
  },
  {
    name: 'Bryn Mawr',
    lngLat: [-75.31445475365415, 40.02788246794094],
    logo: null,
    notablePanelLabel: 'Notable Figure',
    motto: '<<Veritatem Dilexi>>\n(I Delight in the Truth)',
    description: 'Bryn Mawr college was founded on the bequest of Dr. Joseph Wight Taylor, and was originally a Quaker organization. But by 1893 it was no longer associated with any particular religious order. Since Bryn Mawr`s founding, it has offered graduate degrees—making it the first all women`s college where that level of education was available.\n\nIn 2015, Bryn Mawr became the fourth women`s college to accept transgender women and intersex applicants who identified as women. \n\nBryn Mawr currently has and has always had a focus on bringing out the individuality of women through education, with a particular focus on creating the next generation of women world leaders.',
    notableFigure: {
      name: 'Martha Carey Thomas',
      image: marthaImg,
      bio: 'While Martha Carey Thomas never attended Bryn Mawr, she was an advocate for women`s education and the second president of the college. She fought to bring women`s educational standards up to that of men at the time saying in a 1908 address, “The passionate desire of women of my generation for higher education was accompanied throughout its course by the awful doubt, felt by women themselves as well as by men, as to whether women as a sex were physically and mentally fit for it….We were told that their brains were too light, their foreheads too small, their reasoning powers too defected, their emotions too easily worked upon to make good students. None of these things has proved true. Perhaps the most wonderful thing of all to have come true is the wholly unexpected, but altogether delightful, mental ability shown by women college students” (Thomas 1907).\n\nWhile she did avocate for some women she did not advocate for //all// women, and was a supporter of eugenics and white supremacy. In a letter to Marion Park Thomas writes, “If negro students are admitted to Bryn Mawr their negro men friends would have to be permitted to call and be entertained in the college drawing rooms and to be included in outside audiences of lectures, concerts etc, and in student`s plays and other entertainments. \nSocial customs change very slowly. As yet there seems to be little, if any, appreciable movement toward the admission of negroes into our social life, or toward intermarriage between whites and negroes, which always follows the breaking down of social barriers. On the contrary, I believe, that the result of the scientific studies of the effects of immigration and of the teachings of heredity now being made are leading us in the other direction” (Thomas par. 4).',
    },
  },
]

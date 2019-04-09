// var shuffleSequence = seq("sel", "intro", sepWith("sep", seq("practice", rshuffle("s1", "s2"))), sepWith("sep", rshuffle("q1", "q2")));
//var shuffleSequence = seq("fragment", "sep", "fragment");   // For now, the only thing to test
var shuffleSequence = sepWith("sep", "fragment");   // For now, the only thing to test
var practiceItemTypes = ["practice"];

var globalBuffer = "INIT";

var defaults = [
    "FragmentForm", {
        text: "",
        phase: "mid",
        saveReactionTime: true,
        continueOnReturn: true,
    },
    "Separator", {
        transfer: 1000,
        normalMessage: "Please wait for the next fragment.",
        errorMessage: "Wrong. Please wait for the next sentence."
    },
    "DashedSentence", {
        mode: "self-paced reading"
    },
    "AcceptabilityJudgment", {
        as: ["1", "2", "3", "4", "5", "6", "7"],
        presentAsScale: true,
        instructions: "Use number keys or click boxes to answer.",
        leftComment: "(Bad)", rightComment: "(Good)"
    },
    "Question", {
        hasCorrect: true
    },
    "Message", {
        hideProgressBar: true
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    }
];

var texts = [
    [["   &#8226; Where are you going?", "   &#8226; Motel’s that way.", "   &#8226; Would you believe me if I told you I know a shortcut?", "   &#8226; So, there’s this party tonight…", "   &#8226; August, no!", "   &#8226; But it’s perfect!", "   &#8226; It’s my last night in Aberdeen!", "   &#8226; I’ll never be in this town again!", "   &#8226; No, we can’t.", "   &#8226; But it’ll be like a going away party!", "   &#8226; And I want you to come with me!", "   &#8226; You can meet the friends I made while I was here!", "   &#8226; Mom will freak out if we don’t come back to the motel tonight.", "   &#8226; She’ll never know."],
      [[0, 3, 6, 9, 12], [1, 4, 7, 10, 13], [2, 5, 8, 11], [3, 6, 9, 12]]],
    [["   &#8226; You saved my life, you know.", "   &#8226; But the problem with that is that I wanted to die.", "   &#8226; Look, I… No, I know.", "   &#8226; I get why you did it.", "   &#8226; I would have jumped in after someone, too.", "   &#8226; But what I don’t understand is how it all went down.", "   &#8226; What do you mean?", "   &#8226; You weren’t just some random person walking down the street who saw me jump.", "   &#8226; You’re August’s brother.", "   &#8226; We’re connected through him.", "   &#8226; How did you know I was going to be there?", "   &#8226; How did you know to come?", "   &#8226; I don’t know.", "   &#8226; I thought you were him at first.", "   &#8226; I know that’s stupid, but I thought you were him and I wanted so badly for you to be him."],
      [[0, 3, 6, 9, 12], [1, 4, 7, 10, 13], [2, 5, 8, 11, 14], [3, 6, 9, 12], [4, 7, 10, 13]]],
    [["   &#8226; Alf: You we're talking about uh Bad Manners at the weekend but I'm uh in work all weekend", "   &#8226; Beth: Are you Why Sure you won't be able to get a bus in and out of Downpatrick", "   &#8226; Alf: And we we're started 2 sylls Well I'm still working I'm still on duty", "   &#8226; Beth: Are you not going out for a drink", "   &#8226; Alf: I won't be able to", "   &#8226; Beth: At all", "   &#8226; Alf: Well not really Well I'm working Saturday and Sunday but uhm Saturday Sunday Monday Tuesday Wednesday Thursday and then Friday I'm away But the fact is we're moving sort of half moving back in now Most of the work's finished", "   &#8226; Beth: Ah Aye did you get much done last Sunday", "   &#8226; Alf: Uhm yeah a good bit yeah", "   &#8226; Beth: Dragged out of our beds", "   &#8226; Alf: I got shouted at like all day that oh you were here sure Ah I got a good bit done like but we're we're sort of moving back in so", "   &#8226; Beth: Was Leslie pissed off", "   &#8226; Alf: Don't know Why", "   &#8226; Beth: Did you not see him", "   &#8226; Alf: I did Aye he's alright", "   &#8226; Beth: Yeah", "   &#8226; Alf: Yeah He's dead-on", "   &#8226; Beth: Okay"],
      [[0, 4, 8, 12, 16], [1, 5, 9, 13, 17], [2, 6, 10, 14], [3, 7, 11, 15]]],
    [["   &#8226; Sue: So I'm just going to like have a drink here and then go up afterwards", "   &#8226; Bob: Right", "   &#8226; Sue: What about you", "   &#8226; Bob: Well Bad Manners are playing tomorrow night", "   &#8226; Sue: Oh yes Yes Saoirse was saying Jessie's going Are you going as well", "   &#8226; Bob: And I love them Jessie's not going", "   &#8226; Sue: Oh is she not", "   &#8226; Bob: Not as far as I know", "   &#8226; Sue: Oh I must 've got confused between you and Jessie", "   &#8226; Bob: Cos Jessie uhm was saying she wants to go on a binge on Saint Paddy's Day all day So she wants to save herself Saturday night", "   &#8226; Sue: Oh yeah that's right Ah", "   &#8226; Bob: Which is just nonsense", "   &#8226; Sue: It kind of is isn't it", "   &#8226; Bob: Yeah But Bad Manners is on and then Crescent Arts is on after that", "   &#8226; Sue: I know it is I know and I was just torn between", "   &#8226; Bob: Mm and I was hoping you 'd go", "   &#8226; Sue: I know And I was going to but then we heard about this party and I think it is actually going to be really good", "   &#8226; Bob: Uh-huh", "   &#8226; Sue: So it 'd be really good if you could come up afterwards or something", "   &#8226; Bob: Right Give me the hold on and I 'll get a pen"],
      [[0, 4, 8, 12, 16], [1, 5, 9, 13, 17], [2, 6, 10, 14, 18], [3, 7, 11, 15, 19], [4, 8, 12, 16]]],
    [["   &#8226; Lisa: Yeah Where", "   &#8226; Kate: We went to the second-hand shop in Stillorgan You know that one that uhm that's does the debs dresses", "   &#8226; Lisa: Where is it", "   &#8226; Kate: It's in Stillorgan", "   &#8226; Lisa: No I don't think I know it", "   &#8226; Kate: Well Rosemary and I went in for a look and uhm I found a lovely red dress And I was like delighted with it and everything And I brought mum up to see it and she totally ditched it", "   &#8226; Lisa: Yeah Yeah Why", "   &#8226; Kate: She said it looked like she was you she was saying it didn't do anything for my hips It made my hips look big and like my you know my bum and hips and everything I was really excited cos I had the dress and then I just", "   &#8226; Lisa: But did you like it", "   &#8226; Kate: Yeah", "   &#8226; Lisa: But she turned you off it", "   &#8226; Kate: Yeah well I mean I'm hardly going to wear it now seeing everyone thinking I 've big hips Hip girl I 'll be called hippy Hippo"],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9]]],
    [["I am new here so I dont know if this has been posted but me and my father bought iPhone 3G's then two weeks later he went swimming with his.", "So he wanted to get another one but didnt want to pay the $400.", "So we went to at&t and we told them what happened and they said with an iPhone you are always eligable for an upgrade and you can get a new iPhone at the same price but you just have to restart your 2yr agreement.", "Since we only had the phones for 2weeks restarting the 2yrs was nothing.", "So we went to the apple store and told them we had water damage they said we need a new phone.", "So we went like we were getting a phone and we got a new phone for the same 199 and restarted our contract.", "Then sold the water damged one for 400 on ebay."],
      [[0, 2, 4, 6], [1, 3, 5], [2, 4, 6]]],
    [["We've passed this irrigation canal, for the watering of the fields, many years and many seasons.", "Yesterday, the canal caught my eye in the gusty rain.", "The colors were deeper, saturated, and the landscape nearly a painting.", "An ordinary irrigation canal beautiful in the rain.", "Pulled off on the side, no shoulder, of a two-lane highway, windshields wipers swishing, traffic splashing by, I was able to capture what I saw.", "By the way, I wasn't driving this time.", "Dear John managed maneuvering the truck around drop-offs and ditches, while watching the traffic, as I focused the camera and clicked with blowing rain through the window.", "We spent the next few hours trading driving, and snapping photos from within the truck, and truly enjoyed our rainy photographic escapade.", "We were amazed how the rain brought out the colors, and ordinary things were magical."],
      [[0, 2, 4, 6, 8], [1, 3, 5, 7], [2, 4, 6, 8], [3, 5, 7]]],
    [["My first day here was a shock.", "The way the people kissed, the way those two young girls were holding hands.", "They were bumping into each other without concern about the obvious perils.", "Almost 7 billion people in a touching frenzy. It might be a shadow world, but it is so compelling.", "I recoiled in fear when the officer briefly touched my fingers handing me the papers.", "The electricity, the quick transfer of warmth - so strange to me, yet so familiar.", "I researched their history.", "Their weapon in the great war was a bomb, not a chemical one gone out of control.", "A chemical so powerful that made us allergic to each other, that almost wiped our entire species.", "When you've never been touched it is frightening to step outside.", "Are you ready?"],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8]]],
    [["My sledge hits the cheap wood of the door near the handle with a solid crunch.", "I drop it immediately, boot the door open and swing the rifle around.", "The noise isn’t just loud, it’s fucking deafening.", "It makes it easier though, the whole thing seems less real when it’s that loud.", "The shattered door opens into a squalid living room.", "Dim shapes squirm and jerk as the rounds punch holes in them.", "Quickly, I check every corner of the shabby apartment: Kitchen, bedroom, bathroom…", "You’d think they’d try the shower, or a closet, but that’d be way too damned human of them.", "I let the rifle swing back and grab the sledge as I run out the door.", "I don’t stop running for two blocks.", "I counted eight this time, fucking ridiculous...", "Now I have to go to work."],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9]]],
    [["It was the middle of the night when I heard continuous tapping.", "Slightly, I opened my eyes to see a light in the hallway and noticed that there was a lack of warmth by the side of my bed.", "My wife, Annie must’ve have been tapping, so I went downstairs to figure the situation out. My eyes were still adjusting to the dim light, but I quickly noticed a grisly shadow.", "It was an unfamiliar figure, it was a bitter looking intruder, and next to him was my wife, cold on the floor.", "Then the intruder’s black eyes coldly shot mine, and with his rough hands, he shot me.", "A gleam of light shines in my eyes and I quickly rise up.", "I panic, it seems as though I’ve been in deep slumber for a long time.", "As I rise up, I pulled on something which went into my skin; it was an IV needle which I detached.", "Unclear to this situation, I look at my surroundings.", "My IV bag is completely empty, the Hospital is filled with complete silence and the room is faint."],
      [[0, 2, 4, 6, 8], [1, 3, 5, 7, 9], [2, 4, 6, 8], [3, 5, 7, 9], [4, 6, 8]]],
    [["It was clear from the President's speech that he wanted to make minor changes to preserve authorities that we don't need.", "The President created a review board from officials that were personal friends, from national security insiders, former Deputy of the CIA, people who had every incentive to be soft on these programs and to see them in the best possible light.", "But what they found was that these programs have no value, they've never stopped a terrorist attack in the United States, and they have marginal utility at best for other things.", "The only thing that the Section 215 phone meta-data program, actually it's a broader meta-data program of bulk collection, bulk collection means mass surveillance, program was in stopping or detecting a $8,500 wire transfer from a cab driver in California.", "And, it's this kind of review, where insiders go 'we don't need these programs, these programs don't make us safe.", "They take a tremendous amount of resources to run, and they offer us no value.'", "They go 'we can modify these.'", "The National Security agency operates under the President's executive authority alone.", "He can end, or modify, or direct a change in their policies at any time."],
      [[0, 2, 4, 6, 8], [1, 3, 5, 7], [2, 4, 6, 8], [3, 5, 7]]],
    [["Today, I want to show you a new kind of map.", "This is not a geographic map.", "This is a map of the relationships between people in my hometown of Baltimore, Maryland,", "and what you can see here is that each dot represents a person,", "each line represents a relationship between those people,", "and each color represents a community within the network.", "Now, I'm here on the green side, down on the far right where the geeks are,", "and TEDx also is down on the far right. (Laughter)", "Now, on the other side of the network, you tend to have primarily African-American and Latino folks", "who are really concerned about somewhat different things than the geeks are,", "but just to give some sense, the green part of the network we call Smalltimore, for those of us that inhabit it,", "because it seems as though we're living in a very small town."],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9]]],
    [["Now clearly, these are environmental and social issues,", "but that's not all.", "They're economic issues, and that makes them relevant to risk and return.", "And they are really complex and they can seem really far off,", "that the temptation may be to do this:", "bury our heads in the sand and not think about it.", "Resist this, if you can. Don't do this at home. (Laughter)", "But it makes me wonder if the investment rules of today are fit for purpose tomorrow.", "We know that investors, when they look at a company and decide whether to invest,", "they look at financial data, metrics like sales growth, cash flow, market share, valuation -- you know, the really sexy stuff.", "And these things are fundamental, of course,", "but they're not enough.", "Investors should also look at performance metrics in what we call ESG: environment, social and governance."],
      [[0, 3, 6, 9, 12], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9, 12]]],
    [["I feel so fortunate that my first job was working at the Museum of Modern Art on a retrospective of painter Elizabeth Murray.", "I learned so much from her.", "After the curator Robert Storr selected all the paintings from her lifetime body of work,", "I loved looking at the paintings from the 1970s.", "There were some motifs and elements that would come up again later in her life.", "I remember asking her what she thought of those early works.", "If you didn't know they were hers,", "you might not have been able to guess.", "She told me that a few didn't quite meet her own mark for what she wanted them to be.", "One of the works, in fact, so didn't meet her mark, she had set it out in the trash in her studio,", "and her neighbor had taken it because she saw its value.", "In that moment, my view of success and creativity changed.", "I realized that success is a moment, but what we're always celebrating is creativity and mastery."],
      [[0, 3, 6, 9, 12], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9, 12]]],
    [["As my family and I ran for safety when I was about 12 from one of those attacks,", "I resolved that I would do everything I could to ensure that my own children would not go through the same experiences we had.", "They would, in fact, be part of a Sierra Leone where war and amputation were no longer a strategy for gaining power.", "As I watched people who I knew, loved ones, recover from this devastation,", "one thing that deeply troubled me was that many of the amputees in the country would not use their prostheses.", "The reason, I would come to find out, was that their prosthetic sockets were painful because they did not fit well.", "The prosthetic socket is the part in which the amputee inserts their residual limb, and which connects to the prosthetic ankle.", "Even in the developed world, it takes a period of three weeks to often years for a patient to get a comfortable socket, if ever.", "Prosthetists still use conventional processes like molding and casting to create single-material prosthetic sockets.", "Such sockets often leave intolerable amounts of pressure on the limbs of the patient, leaving them with pressure sores and blisters.", "It does not matter how powerful your prosthetic ankle is.", "If your prosthetic socket is uncomfortable, you will not use your leg,", "and that is just simply unacceptable in our age."],
      [[0, 3, 6, 9, 12], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9, 12]]],
    [["Sara Albert, a 34-year-old Dallas law student, says she's generally skittish about the stock market and the takeover activity that seems to fuel it.", "'I have this feeling that it's built on sand,' she says,", "that the market rises 'but there's no foundation to it.'", "She and her husband pulled most of their investments out of the market after the 1987 crash,", "although she still owns some Texaco stock.", "Partly because of concern about the economy and partly because she recently quit her job as a legal assistant to go to school,", "'I think at this point we want to be a lot more liquid.'"],
      [[0, 2, 4, 6], [1, 3, 5], [2, 4, 6]]],
    [["In the early 1980s, P&G tried to launch here a concentrated detergent under the Ariel brand name that it markets in Europe.", "But the product, which wasn't as concentrated as the new Cheer, bombed in a market test in Denver and was dropped.", "P&G and others also have tried repeatedly to hook consumers on detergent and fabric softener combinations in pouches,", "but they haven't sold well, despite the convenience.", "But P&G contends the new Cheer is a unique formula", "that also offers an ingredient that prevents colors from fading.", "And retailers are expected to embrace the product,", "in part because it will take up less shelf space.", "'When shelf space was cheap, bigger was better,' says Hugh Zurkuhlen, an analyst at Salomon Bros.", "But with so many brands vying for space, that's no longer the case."],
      [[0, 2, 4, 6, 8], [1, 3, 5, 7, 9], [2, 4, 6, 8], [3, 5, 7, 9], [4, 6, 8]]],
    [["With economic tension between the U.S. and Japan worsening, many Japanese had feared last week's visit from U.S. Trade Representative Carla Hills.", "They expected a new barrage of demands", "that Japan do something quickly to reduce its trade surplus with the U.S.", "Instead, they got a discussion of the need for the U.S. and Japan to work together and of the importance of the long-term view.", "Mrs. Hills' first trip to Japan as America's chief trade negotiator had a completely different tone from last month's visit by Commerce Secretary Robert A. Mosbacher.", "Mr. Mosbacher called for concrete results by next spring in negotiations over fundamental Japanese business practices that supposedly inhibit free trade.", "He said such results should be 'measurable in dollars and cents' in reducing the U.S. trade deficit with Japan.", "But Mrs. Hills, speaking at a breakfast meeting of the American Chamber of Commerce in Japan on Saturday, stressed that the objective 'is not to get definitive action by spring or summer, it is rather to have a blueprint for action.'"],
      [[0, 2, 4, 6], [1, 3, 5, 7], [2, 4, 6], [3, 5, 7]]],
    [["Olivetti has denied that it violated Cocom rules, asserting that the reported shipments were properly licensed by the Italian authorities.", "Although the legality of these sales is still an open question,", "the disclosure couldn't be better timed to support the position of export-control hawks in the Pentagon and the intelligence community.", "'It seems to me that a story like this breaks just before every important Cocom meeting,' said a Washington lobbyist for a number of U.S. computer companies.", "The Bush administration has sent conflicting signals about its export-control policies,", "reflecting unhealed divisions among several competing agencies.", "Last summer, Mr. Bush moved the administration in the direction of gradual liberalization", "when he told a North Atlantic Treaty Organization meeting that he would allow some exceptions to the Cocom embargo of strategic goods.", "But more recently, the Pentagon and the Commerce Department openly feuded over the extent to which Cocom should liberalize exports of personal computers to the bloc.", "However, these agencies generally agree that the West should be cautious about any further liberalization.", "'There's no evidence that the Soviet program to (illegally) acquire Western technology has diminished,' said a State Department spokesman."],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8]]],
    [["The debate that a handful of Texas multi-millionnaires close to the Bush family have cleverly manufactured over John Kerry's war record is absurd in every way.", "The charges that they have put some vets up to making against Kerry are false and can be demonstrated by the historical record to be false.", "Most of those making the charges have even flip-flopped, contradicting themselves.", "Or they weren't eyewitnesses and are just lying.", "But to address the substance of this Big Lie is to risk falling into its logic.", "The true absurdity of the entire situation is easily appreciated when we consider that George W. Bush never showed any bravery at all at any point in his life.", "He has never lived in a war zone.", "If some of John Kerry's wounds were superficial, Bush received no wounds."],
      [[0, 2, 4, 6], [1, 3, 5, 7], [2, 4, 6], [3, 5, 7]]],
    [["When we arrived at the homesite yesterday,", "a contractor was already filling in the trench that brought the power and phone cables to the nearly completed workshop.", "An hour later, he had installed the meter", "and we were good to go as far as electrical power is concerned.", "I was pleased to see that the power cables were 3/4 inch in diameter,", "as the run from the transformer is about 200 feet.", "The telephone company still needs to do its peculiar magic", "before we can log onto the Internet,", "but that too should be handled in the next few days.", "Unlike some family and friends who are content to live 'off the grid' as a solution to finding a satisfying lifestyle,", "I feel that we live in a connected world", "and a satisfying lifestyle has to involve involve open communication."],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9]]],
    [["Are they really any safer, now?", "Seeing the efforts big business has been making to remove government oversight where it can,", "I'm not terribly confident about that.", "UL isn't government.", "From my experience (mostly residential lighting equipment),", "I haven't noticed any relaxation of standards for fire or electrical safety.", "If anytthing, It has been just the opposite.", "Competition appears to be good for UL.", "Manufacturers have options including ETL and CSA (Canadian Standards Association) and others", "so there are alternatives.", "That helps costs and speed of testing.", "They all test to the same standards."],
      [[0, 3, 6, 9], [1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9]]],
]

function generate_items(texts, max_num_questions) {
    var items = [];
    for (var i = 0; i < texts.length; i++) {
        sentences = texts[i][0];
        cuttings = texts[i][1];
        for (var j = 0; j < cuttings.length; j++) {
            cuts = cuttings[j];
            prev_cut = 0
            item = [["fragment", i]]
            for (var h = 0; h <= cuts.length; h++) {
                var text = "";
                if (h == cuts.length) {
                    if (prev_cut < sentences.length) {
                        text = sentences.slice(prev_cut, sentences.length).join(' ');
                    }
                } else if (cuts[h] > 0) {
                    text = sentences.slice(prev_cut, cuts[h]).join(' ');
                    prev_cut = cuts[h];
                }
                if (text != "") {
                    if (h == 0) {   // If it's the first chunk
                        item.push("FragmentForm");
                        item.push({type: "question", phase: "start", text: text});
                    } else { // If it's in the middle or end
                        item.push("FragmentForm");
                        item.push({type: "answer", text: text});
                        for (var k=1; k < max_num_questions; k++) { // Permit space for older questions too
                            item.push("FragmentForm");
                            item.push({type: "answer"});
                        }
                        if (h != cuts.length) {     // Everywhere except last, ask for a new question.
                            item.push("FragmentForm");
                            item.push({type: "question"});
                        }
                    }
                }
            }
            item.push("FragmentForm");
            item.push({type: "answer", text: "", phase: "end"});  // TODO Maybe have a separate "end" form with some questions.
            items.push(item);
        }
    }
    return items;
}


var items = [

    // New in Ibex 0.3-beta-9. You can now add a '__SendResults__' controller in your shuffle
    // sequence to send results before the experiment has finished. This is NOT intended to allow
    // for incremental sending of results -- you should send results exactly once per experiment.
    // However, it does permit additional messages to be displayed to participants once the
    // experiment itself is over. If you are manually inserting a '__SendResults__' controller into
    // the shuffle sequence, you must set the 'manualSendResults' configuration variable to 'true', since
    // otherwise, results are automatically sent at the end of the experiment.
    //
    //["sr", "__SendResults__", { }],

    ["sep", "Separator", { }],

    // New in Ibex 0.3-beta19. You can now determine the point in the experiment at which the counter
    // for latin square designs will be updated. (Previously, this was always updated upon completion
    // of the experiment.) To do this, insert the special '__SetCounter__' controller at the desired
    // point in your running order. If given no options, the counter is incremented by one. If given
    // an 'inc' option, the counter is incremented by the specified amount. If given a 'set' option,
    // the counter is set to the given number. (E.g., { set: 100 }, { inc: -1 })
    //
    //["setcounter", "__SetCounter__", { }],

    // NOTE: You could also use the 'Message' controller for the experiment intro (this provides a simple
    // consent checkbox).

    ["intro", "Form", {
        html: { include: "example_intro.html" },
        validators: {
            age: function (s) { if (s.match(/^\d+$/)) return true; else return "Bad value for \u2018age\u2019"; }
        }
    } ],

];

items.push.apply(items, generate_items(texts, 3))

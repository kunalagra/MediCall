import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { AiFillWechat } from "react-icons/ai";
import { MdClear } from "react-icons/md"; 
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const BackTop = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const systemMessage = {
    role: "system",
    content: "Only answer health related questions and do not mention anything about chatgpt and open ai",
  };
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      window.scrollY >= 100 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // back-to-top functionality
  const handleBackTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const HEALTH_KEYWORDS = ["health", "medicine", "doctor", "hospital", "symptom", "colour blindness","myopia","hypermetropia","bronchitis","cough",
  "cold","tuberculosis","tb","dry eyes","eye","chalization","appendictius","dysepia","food poison","food poisoning","gastritis",
  "ibs","peptic ulcer","ulcer","coitis","allergy","kidney","kidney failure","kidney stone",,"fever","stone","appendix", "food allergy",
  "vomit","pain", "abdomen acute", "abdominal bloating", "abdominal tenderness", "abnormal sensation","abnormally hard consistency","abscess bacterial",
  "absences finding","achalasia","ache","adverse effect","adverse reaction","agitation","air fluid level","alcohol binge episode","alcoholic withdrawal symptoms",
  "ambidexterity","angina pectoris","anorexia","anosmia","aphagia","apyrexial","arthralgia","ascites","asterixis","asthenia","asymptomatic","ataxia",
  "atypia","aura","awakening early","barking cough","bedridden","behavior hyperactive","behavior showing increased motor activity","blackout",
  "blanch","bleeding of vagina","bowel sounds decreased","bradycardia","bradykinesia","breakthrough pain","breath sounds decreased","breath-holding spell",
  "breech presentation", "bruit","burning sensation","cachexia","cardiomegaly","cardiovascular event","cardiovascular finding","catatonia","catching breath","charleyhorse",
  "chest discomfort","chest tightness","chill","choke","cicatrisation","clammy skin","claudication","clonus","clumsiness","colic abdominal","consciousness clear","constipation",
  "coordination abnormal","cough","cushingoid facies","cushingoid\u00a0habitus","cyanosis","cystic lesion","debilitation","decompensation","decreased body weight","decreased stool caliber",
  "decreased translucency","diarrhea","difficulty","difficulty passing urine","disequilibrium","distended abdomen","distress respiratory","disturbed family","dizziness",
  "dizzy spells","drool","drowsiness","dry cough","dullness","dysarthria","dysdiadochokinesia","dysesthesia","dyspareunia","dyspnea","dyspnea on exertion","dysuria",
  "ecchymosis","egophony","elation","emphysematous change","energy increased","enuresis","erythema","estrogen use","excruciating pain","exhaustion","extrapyramidal sign","extreme exhaustion",
  "facial paresis","fall","fatigability","fatigue","fear of falling","fecaluria","feces in rectum","feeling hopeless","feeling strange","feeling suicidal","feels hot/feverish",
  "fever","flare","flatulence","floppy","flushing","focal seizures","food intolerance","formication","frail","fremitus","frothy sputum","gag","gasping for breath","general discomfort","general unsteadiness","giddy mood","gravida 0","gravida 10","green sputum",
  "groggy","guaiac positive","gurgle","hacking cough","haemoptysis","haemorrhage","hallucinations auditory","hallucinations visual", "has religious belief", "headache", "heartburn","heavy feeling", "heavy legs", "heberden's node", "hematochezia","hematocrit decreased",
  "hematuria","heme positive","hemianopsia homonymous","hemiplegia","hemodynamically stable","hepatomegaly","hepatosplenomegaly", "hirsutism", "history of - blackout","hoard","hoarseness","homelessness","homicidal thoughts","hot flush",
  "hunger", "hydropneumothorax", "hyperacusis","hypercapnia","hyperemesis","hyperhidrosis disorder","hyperkalemia","hypersomnia","hypersomnolence","hypertonicity","hyperventilation", "hypesthesia", "hypoalbuminemia", "hypocalcemia result", "hypokalemia", "hypokinesia","hypometabolism",
  "hyponatremia","hypoproteinemia","hypotension","hypothermia, natural","hypotonic","hypoxemia","immobile", "impaired cognition","inappropriate affect","incoherent","indifferent mood","intermenstrual heavy bleeding","intoxication", "irritable mood", "jugular venous distention", "labored breathing","lameness",
  "large-for-dates fetus","left\u00a0atrial\u00a0hypertrophy","lesion","lethargy","lightheadedness","lip smacking","loose associations","loss of taste or smell", "low back pain", "lung nodule","macerated skin","macule","malaise","mass in breast","mass of body structure","mediastinal shift","mental status changes",
  "metastatic lesion","milky","moan","monoclonal","monocytosis","mood depressed","moody","motor retardation","murphy's sign","muscle hypotonia","muscle twitch","myalgia","mydriasis","myoclonus","nasal discharge present","nasal flaring", "nausea","nausea and vomiting","neck stiffness","neologism", "nervousness","night sweat","nightmare",
  "no known drug allergies","no status change","noisy respiration","non-productive cough","nonsmoker","numbness","numbness of hand","oliguria","orthopnea", "orthostasis","out of breath","overweight","pain", "pain abdominal","pain back","pain chest","pain foot","pain in lower limb","pain neck","painful swallowing","pallor", "palpitation","panic",
  "pansystolic murmur","paralyse","paraparesis","paresis","paresthesia","passed stones","patient non compliance","pericardial friction rub","phonophobia","photophobia","photopsia","pin-point pupils","pleuritic pain","pneumatouria", "polydypsia", "polymyalgia", "polyuria","poor dentition","poor feeding","posterior\u00a0rhinorrhea","posturing","presence of q wave","pressure chest",
  "previous pregnancies 2","primigravida","prodrome","productive cough","projectile vomiting", "prostate tender", "prostatism","proteinemia","pruritus","pulse absent", "pulsus\u00a0paradoxus","pustule","qt interval prolonged",
  "r wave feature","rale","rambling speech","rapid shallow breathing","red blotches","redness","regurgitates after swallowing", "renal angle tenderness","rest pain","retch", "retropulsion","rhd positive", "rhonchus", "rigor - temperature-associated observation", "rolling of eyes", "room spinning","satiety early","scar tissue", "sciatica","scleral\u00a0icterus","scratch marks","sedentary", "seizure",
  "sensory discomfort","shooting pain","shortness of breath","side pain","sinus rhythm","sleeplessness","sleepy","slowing of urinary stream", "sneeze", "sniffle", "snore", "snuffle", "soft tissue swelling","sore to touch","spasm","speech slurred", "splenomegaly", "spontaneous rupture of membranes","sputum purulent","st segment depression","st segment elevation", "stahli's line","stiffness","stinging sensation","stool color yellow", "stridor", "stuffy nose",
  "stupor","suicidal","superimposition","sweat", "sweating increased","swelling","symptom aggravating factors","syncope","systolic ejection murmur","systolic murmur","t wave inverted","tachypnea","tenesmus", "terrify","thicken", "throat sore", "throbbing sensation quality", "tinnitus", "titubation", "todd paralysis", "tonic seizures", "transaminitis","transsexual", "tremor", "tremor resting","tumor cell invasion","unable to concentrate",
  "unconscious state","diabetes","uncoordination", "underweight","unhappy", "unresponsiveness", "cancer", "unsteady gait", "unwell", "urge incontinence", "urgency of\u00a0micturition", "urinary hesitation", "urinoma", "verbal auditory hallucinations", "verbally abusive behavior", "vertigo", "vision blurred", "vomiting", "weepiness","weight gain", "welt","wheelchair bound","wheezing","withdraw", "worry", "yellow sputum",
  "pansystolic murmur", "paralyse", "paraparesis", "paresis", "paresthesia", "passed stones","patient non compliance", "pericardial friction rub", "phonophobia", "photophobia","photopsia","pin-point pupils","pleuritic pain","pneumatouria","polydypsia","polymyalgia","polyuria","poor dentition","poor feeding",
"posterior rhinorrhea","posturing","presence of q wave","pressure chest","previous pregnancies 2","primigravida","prodrome","productive cough","projectile vomiting","prostate tender","prostatism","proteinemia","pruritus","pulse absent","pulsus paradoxus","pustule","qt interval prolonged","r wave feature","rale","rambling speech","rapid shallow breathing","red blotches","redness","regurgitates after swallowing","renal angle tenderness",
"rest pain","retch","retropulsion", "rhd positive","rhonchus","rigor - temperature-associated observation","rolling of eyes","room spinning","satiety early","scar tissue","sciatica","scleral icterus","scratch marks","sedentary","seizure","sensory discomfort","shooting pain","shortness of breath","side pain","sinus rhythm","sleeplessness","sleepy","slowing of urinary stream","sneeze","sniffle","snore","snuffle","soft tissue swelling","sore to touch","spasm","speech slurred",
"splenomegaly","spontaneous rupture of membranes","sputum purulent","st segment depression","st segment elevation","stahli's line","stiffness","stinging sensation","stool color yellow","stridor","stuffy nose","stupor","suicidal","superimposition","sweat","sweating increased","swelling","symptom aggravating factors","syncope","systolic ejection murmur","systolic murmur","t wave inverted","tachypnea","tenesmus","terrify",
"thicken","throat sore","throbbing sensation quality","tinnitus","titubation","todd paralysis","tonic seizures","transaminitis","transsexual","tremor","tremor resting","tumor cell invasion","unable to concentrate","unconscious state","uncoordination","underweight","unhappy","unresponsiveness","cancer","unsteady gait","unwell","urge incontinence","urgency of micturition","urinary hesitation","urinoma","verbal auditory hallucinations","verbally abusive behavior","vertigo","vision blurred","vomiting","weepiness",
"weight gain","welt","wheelchair bound","wheezing","withdraw","worry","yellow sputum",    "Hypertensive disease","Coronavirus disease 2019","Diabetes","Depression mental","Depressive disorder","Coronary arteriosclerosis","Coronary heart disease","Pneumonia","Failure heart congestive","Accident cerebrovascular","Asthma","Myocardial infarction","Hypercholesterolemia","Infection","Infection urinary tract","Anemia","Chronic obstructive airway disease","Dementia","Insufficiency renal","Confusion","Degenerative polyarthritis","Hypothyroidism","Anxiety state","Malignant neoplasms",
"Primary malignant neoplasm","Acquired immuno-deficiency syndrome","Hiv","Hiv infections","Cellulitis","Gastroesophageal reflux disease","Septicemia","Systemic infection","Sepsis (invertebrate)","Deep vein thrombosis","Dehydration","Neoplasm","Embolism pulmonary","Epilepsy","Cardiomyopathy","Chronic kidney failure","Carcinoma","Hepatitis c","Peripheral vascular disease","Psychotic disorder","Hyperlipidemia","Bipolar disorder","Obesity","Ischemia","Cirrhosis","Exanthema","Benign prostatic hypertrophy","Kidney failure acute","Mitral valve insufficiency","Arthritis","Bronchitis","Hemiparesis","Osteoporosis",
"Transient ischemic attack","Adenocarcinoma","Paranoia","Pancreatitis","Incontinence","Paroxysmal dyspnea","Hernia","Malignant neoplasm of prostate","Carcinoma prostate","Edema pulmonary","Lymphatic diseases","Stenosis aortic valve","Malignant neoplasm of breast","Carcinoma breast","Schizophrenia","Diverticulitis","Overload fluid","Ulcer peptic","Osteomyelitis","Gastritis","Bacteremia","Failure kidney","Sickle cell anemia","Failure heart","Upper respiratory infection","Hepatitis","Hypertension pulmonary","Deglutition disorder","Gout","Thrombocytopaenia","Hypoglycemia","Pneumonia aspiration","Colitis","Diverticulosis","Suicide attempt",
"Pneumocystis carinii pneumonia","Hepatitis b","Parkinson disease","Lymphoma","Hyperglycemia","Encephalopathy","Tricuspid valve insufficiency","Alzheimer's disease","Candidiasis","Oralcandidiasis","Neuropathy","Kidney disease","Fibroid tumor","Glaucoma","Neoplasm metastasis","Malignant tumor of colon","Carcinoma colon","Ketoacidosis diabetic","Tonic-clonic epilepsy","Tonic-clonic seizures","Malignant neoplasms","Respiratory failure","Melanoma","Gastroenteritis","Malignant neoplasm of lung","Carcinoma of lung","Manic disorder","Personality disorder","Primary carcinoma of the liver cells","Emphysema pulmonary",
"Hemorrhoids","Spasm bronchial","Aphasia","Obesity morbid","Pyelonephritis","Endocarditis","Effusion pericardial","Pericardial effusion body substance","Chronic alcoholic intoxication","Pneumothorax","Delirium","Neutropenia","Hyperbilirubinemia","Influenza","Dependence","Thrombus","Cholecystitis","Hernia hiatal","Migraine disorders","Pancytopenia","Cholelithiasis","Biliary calculus","Tachycardia sinus","Ileus","Adhesion","Delusion","Affect labile","Decubitus ulcer"  
];

const INTRO_WORDS = ["hi", "hii", "hello", "hey", "namaste"];

const handleSend = async (msg) => {
  if(msg==="") return;
  let message = msg.replace(/&nbsp;/g, "").trim();

  console.log(message);

  const newMessage = {
    message: message,
    direction: "outgoing",
    sender: "user",
  };

  const containsHealthKeywords = HEALTH_KEYWORDS.some(keyword => message.toLowerCase().includes(keyword));
  
  if (INTRO_WORDS.includes(message)) {
    setMessages([
      ...messages,
      newMessage,
      {
        message: "Hello!! Welcome to Medicall!!.",
        sender: "ChatGPT",
      },
    ]);
    return;
  }

  if (!containsHealthKeywords && !INTRO_WORDS.includes(message)) {
    setMessages([
      ...messages,
      newMessage,
      {
        message: "I'm sorry, I can only answer health-related questions.",
        sender: "ChatGPT",
      },
    ]);
    return;
  }



  const newMessages = [...messages, newMessage];

  setMessages(newMessages);
  setIsTyping(true);
  await processMessageToChatGPT(newMessages);
};


  const [messages, setMessages] = useState([
    {
      message: "Hello, This is MediBot! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // const handleSend = async (message) => {
  //   const newMessage = {
  //     message,
  //     direction: "outgoing",
  //     sender: "user",
  //   };

  //   const newMessages = [...messages, newMessage];

  //   setMessages(newMessages);
  //   setIsTyping(true);
  //   await processMessageToChatGPT(newMessages);
  // };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }


  return (
    <>
      {!open && (
        <div
          className={`back_top ${isVisible ? "popped" : ""}`}
          title="Back to top"
          onClick={handleBackTop}
        >
          <FaChevronUp />
        </div>
      )}
      <div
        onClick={() => setOpen(!open)} 
        className="back_top popped chat_icon"
        title="Wanna Chat?"
      >
        {open? <MdClear /> : <AiFillWechat />}
      </div>
      <div className={`chatbot ${open && "opened"}`}>
        <div className="chat">
          <MainContainer
          style={{border: 0, borderRadius: 10}}
          >
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="MediBot is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
};

export default BackTop;

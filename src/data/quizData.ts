export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  questions: Question[];
}

export interface Course {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  subjects: Subject[];
}

export const courses: Course[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    icon: "Cpu",
    description: "Master computer science fundamentals and programming",
    color: "from-blue-500 to-cyan-500",
    subjects: [
      {
        id: "java",
        name: "Java",
        icon: "Code",
        description: "Object-oriented programming with Java",
        color: "from-orange-500 to-red-500",
        questions: [
          {
            question: "What is the main difference between an abstract class and an interface in Java?",
            options: ["Abstract classes can have constructors, interfaces cannot", "Interfaces can have method implementations, abstract classes cannot", "Abstract classes support multiple inheritance, interfaces do not", "There is no difference"],
            correct: 0
          },
          {
            question: "Which keyword is used to prevent a class from being inherited in Java?",
            options: ["static", "final", "abstract", "private"],
            correct: 1
          },
          {
            question: "What does JVM stand for?",
            options: ["Java Virtual Machine", "Java Variable Manager", "Java Visual Model", "Java Version Manager"],
            correct: 0
          },
          {
            question: "Which of the following is not a primitive data type in Java?",
            options: ["int", "boolean", "String", "char"],
            correct: 2
          },
          {
            question: "What is the purpose of the 'finally' block in Java exception handling?",
            options: ["To catch exceptions", "To execute code regardless of whether an exception occurs", "To throw exceptions", "To ignore exceptions"],
            correct: 1
          }
        ]
      },
      {
        id: "python",
        name: "Python",
        icon: "Code",
        description: "High-level programming with Python",
        color: "from-yellow-500 to-orange-500",
        questions: [
          {
            question: "What is the output of print(2 ** 3 ** 2) in Python?",
            options: ["64", "512", "8", "27"],
            correct: 1
          },
          {
            question: "Which of the following is not a valid Python data type?",
            options: ["list", "tuple", "dictionary", "array"],
            correct: 3
          },
          {
            question: "What does the 'len()' function return?",
            options: ["Length of a string", "Length of any iterable", "Length of a list only", "Length of a dictionary"],
            correct: 1
          },
          {
            question: "Which keyword is used to define a function in Python?",
            options: ["function", "def", "define", "func"],
            correct: 1
          },
          {
            question: "What is the correct way to create a list in Python?",
            options: ["list = []", "list = {}", "list = ()", "list = <>"],
            correct: 0
          }
        ]
      },
      {
        id: "html",
        name: "HTML",
        icon: "Globe",
        description: "Markup language for web development",
        color: "from-red-500 to-pink-500",
        questions: [
          {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
            correct: 0
          },
          {
            question: "Which tag is used to create a hyperlink in HTML?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            correct: 1
          },
          {
            question: "What is the correct HTML element for the largest heading?",
            options: ["<h1>", "<heading>", "<h6>", "<head>"],
            correct: 0
          },
          {
            question: "Which attribute is used to provide an alternative text for an image?",
            options: ["alt", "src", "title", "href"],
            correct: 0
          },
          {
            question: "What is the purpose of the <div> tag in HTML?",
            options: ["To create a division or section", "To create a link", "To create a list", "To create a table"],
            correct: 0
          }
        ]
      },
      {
        id: "javascript",
        name: "JavaScript",
        icon: "Zap",
        description: "Programming language for web interactivity",
        color: "from-yellow-400 to-yellow-600",
        questions: [
          {
            question: "What is the correct syntax for referring to an external script called 'script.js'?",
            options: ["<script src='script.js'>", "<script href='script.js'>", "<script ref='script.js'>", "<script name='script.js'>"],
            correct: 0
          },
          {
            question: "How do you write 'Hello World' in an alert box?",
            options: ["alert('Hello World');", "msg('Hello World');", "alertBox('Hello World');", "msgBox('Hello World');"],
            correct: 0
          },
          {
            question: "Which operator is used to assign a value to a variable?",
            options: ["*", "-", "=", "+"],
            correct: 2
          },
          {
            question: "What is the correct way to write a JavaScript array?",
            options: ["var colors = ['red', 'green', 'blue']", "var colors = 'red', 'green', 'blue'", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"],
            correct: 0
          },
          {
            question: "Which event occurs when the user clicks on an HTML element?",
            options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
            correct: 1
          }
        ]
      },
      {
        id: "formal-languages-automata",
        name: "Formal Languages and Automata Theory",
        icon: "BookOpen",
        description: "Study of formal languages, automata, and computability",
        color: "from-purple-500 to-indigo-500",
        questions: [
          {
            question: "What is a regular language?",
            options: ["Languages accepted by finite automata", "Languages accepted by pushdown automata", "Languages accepted by Turing machines", "Languages with infinite strings"],
            correct: 0
          },
          {
            question: "Which of the following is not a type of automaton?",
            options: ["Finite Automaton", "Pushdown Automaton", "Turing Machine", "Regular Automaton"],
            correct: 3
          },
          {
            question: "What does DFA stand for?",
            options: ["Deterministic Finite Automaton", "Dynamic Finite Algorithm", "Data Flow Automaton", "Digital Function Array"],
            correct: 0
          },
          {
            question: "Which language class is closed under complement?",
            options: ["Regular languages", "Context-free languages", "Context-sensitive languages", "Recursive languages"],
            correct: 0
          },
          {
            question: "What is the pumping lemma used for?",
            options: ["To prove that a language is regular", "To prove that a language is not regular", "To minimize automata", "To convert NFA to DFA"],
            correct: 1
          }
        ]
      }
    ]
  },
  {
    id: "ece",
    name: "Electronics and Communication Engineering",
    icon: "Radio",
    description: "Explore electronics, communication systems, and signal processing",
    color: "from-green-500 to-emerald-500",
    subjects: [
      {
        id: "digital-electronics",
        name: "Digital Electronics",
        icon: "CircuitBoard",
        description: "Digital circuits, logic gates, and microprocessors",
        color: "from-blue-600 to-blue-800",
        questions: [
          {
            question: "What is the output of an AND gate when both inputs are 1?",
            options: ["0", "1", "Undefined", "Depends on the gate"],
            correct: 1
          },
          {
            question: "How many flip-flops are needed for a 3-bit counter?",
            options: ["1", "2", "3", "4"],
            correct: 2
          },
          {
            question: "What is the binary equivalent of decimal 10?",
            options: ["1010", "1001", "1100", "1110"],
            correct: 0
          },
          {
            question: "Which logic gate produces a HIGH output when all inputs are LOW?",
            options: ["AND", "OR", "NAND", "NOR"],
            correct: 2
          },
          {
            question: "What is the purpose of a multiplexer?",
            options: ["To add signals", "To select one of many inputs", "To store data", "To amplify signals"],
            correct: 1
          }
        ]
      },
      {
        id: "signals-systems",
        name: "Signals and Systems",
        icon: "Waveform",
        description: "Analysis of continuous and discrete signals",
        color: "from-teal-500 to-cyan-500",
        questions: [
          {
            question: "What is the Fourier transform used for?",
            options: ["Time domain analysis", "Frequency domain analysis", "Amplitude analysis", "Phase analysis"],
            correct: 1
          },
          {
            question: "Which of the following is a periodic signal?",
            options: ["sin(t)", "e^(-t)", "t^2", "step(t)"],
            correct: 0
          },
          {
            question: "What does LTI stand for?",
            options: ["Linear Time Invariant", "Linear Time Independent", "Linear Transfer Invariant", "Linear Transform Invariant"],
            correct: 0
          },
          {
            question: "What is the Laplace transform of a unit step function?",
            options: ["1/s", "1/(s^2)", "s", "1"],
            correct: 0
          },
          {
            question: "Which property does convolution satisfy?",
            options: ["Commutative", "Associative", "Distributive", "All of the above"],
            correct: 3
          }
        ]
      }
    ]
  },
  {
    id: "eee_duplicate",
    name: "Electrical and Electronics Engineering",
    icon: "Zap",
    description: "Master electrical systems, power engineering, and electronics",
    color: "from-yellow-500 to-orange-500",
    subjects: [
      {
        id: "electrical-machines",
        name: "Electrical Machines",
        icon: "Cog",
        description: "Study of transformers, motors, and generators",
        color: "from-orange-500 to-red-500",
        questions: [
          {
            question: "What is the main function of a transformer?",
            options: ["Store electrical energy", "Convert AC to DC", "Change voltage levels", "Generate electricity"],
            correct: 0
          },
          {
            question: "Which type of motor is used in electric vehicles?",
            options: ["DC motor", "Induction motor", "Synchronous motor", "All of the above"],
            correct: 3
          },
          {
            question: "What is the synchronous speed of a 4-pole, 50 Hz induction motor?",
            options: ["1500 rpm", "3000 rpm", "750 rpm", "6000 rpm"],
            correct: 0
          },
          {
            question: "What is the efficiency of an ideal transformer?",
            options: ["50%", "75%", "90%", "100%"],
            correct: 3
          },
          {
            question: "Which law is used in transformer operation?",
            options: ["Ohm's law", "Faraday's law", "Kirchhoff's law", "Coulomb's law"],
            correct: 1
          }
        ]
      },
      {
        id: "power-systems",
        name: "Power Systems",
        icon: "Power",
        description: "Generation, transmission, and distribution of electrical power",
        color: "from-red-500 to-pink-500",
        questions: [
          {
            question: "What is the standard frequency for AC power in India?",
            options: ["50 Hz", "60 Hz", "100 Hz", "120 Hz"],
            correct: 0
          },
          {
            question: "Which component is used to protect against lightning strikes?",
            options: ["Fuse", "Circuit breaker", "Lightning arrester", "Relay"],
            correct: 2
          },
          {
            question: "What is the purpose of a substation?",
            options: ["To generate power", "To transform voltage levels", "To store power", "To measure power"],
            correct: 1
          },
          {
            question: "Which type of fault is most common in power systems?",
            options: ["Single line to ground", "Line to line", "Double line to ground", "Three phase"],
            correct: 0
          },
          {
            question: "What is the per unit system used for?",
            options: ["To simplify calculations", "To increase voltage", "To reduce losses", "To improve efficiency"],
            correct: 0
          }
        ]
      },
      {
        id: "control-systems-eee",
        name: "Control Systems",
        icon: "Settings",
        description: "Analysis and design of control systems",
        color: "from-blue-500 to-indigo-500",
        questions: [
          {
            question: "What is the difference between open loop and closed loop control?",
            options: ["Feedback presence", "Controller type", "System complexity", "Response time"],
            correct: 0
          },
          {
            question: "Which controller provides zero steady state error?",
            options: ["P controller", "PI controller", "PD controller", "PID controller"],
            correct: 1
          },
          {
            question: "What is the Nyquist criterion used for?",
            options: ["Stability analysis", "Controller design", "System identification", "Performance evaluation"],
            correct: 0
          },
          {
            question: "Which method is used for root locus analysis?",
            options: ["Routh-Hurwitz", "Nyquist", "Bode", "Evans"],
            correct: 3
          },
          {
            question: "What is the gain margin?",
            options: ["Phase margin at gain crossover", "Gain at phase crossover", "Phase at gain crossover", "Gain at phase margin"],
            correct: 1
          }
        ]
      },
      {
        id: "electrical-measurements",
        name: "Electrical Measurements",
        icon: "Gauge",
        description: "Measurement of electrical quantities and instruments",
        color: "from-green-500 to-teal-500",
        questions: [
          {
            question: "What is the principle of a multimeter?",
            options: ["Ohm's law", "Faraday's law", "Moving coil", "Digital conversion"],
            correct: 2
          },
          {
            question: "Which instrument is used to measure power?",
            options: ["Voltmeter", "Ammeter", "Wattmeter", "Ohmmeter"],
            correct: 2
          },
          {
            question: "What is the accuracy class of a meter?",
            options: ["Maximum reading", "Percentage error", "Resolution", "Range"],
            correct: 1
          },
          {
            question: "Which bridge is used to measure capacitance?",
            options: ["Wheatstone", "Schering", "Anderson", "Kelvin"],
            correct: 1
          },
          {
            question: "What is the purpose of a shunt resistor?",
            options: ["To increase resistance", "To extend ammeter range", "To reduce voltage", "To measure current"],
            correct: 1
          }
        ]
      }
    ]
  },
  {
    id: "civil",
    name: "Civil Engineering",
    icon: "Building",
    description: "Design and construction of infrastructure",
    color: "from-stone-500 to-stone-700",
    subjects: [
      {
        id: "structural-engineering",
        name: "Structural Engineering",
        icon: "Building2",
        description: "Design and analysis of structures",
        color: "from-gray-500 to-slate-500",
        questions: [
          {
            question: "What is the maximum allowable deflection for a beam?",
            options: ["L/100", "L/200", "L/300", "L/400"],
            correct: 2
          },
          {
            question: "Which material has the highest compressive strength?",
            options: ["Wood", "Steel", "Concrete", "Brick"],
            correct: 1
          },
          {
            question: "What is the factor of safety?",
            options: ["Ultimate load / Working load", "Working load / Ultimate load", "Ultimate load * Working load", "Working load - Ultimate load"],
            correct: 0
          },
          {
            question: "Which type of foundation is used in soft soil?",
            options: ["Shallow foundation", "Deep foundation", "Raft foundation", "Pile foundation"],
            correct: 3
          },
          {
            question: "What is the purpose of reinforcement in concrete?",
            options: ["To increase weight", "To resist tensile forces", "To reduce cost", "To improve appearance"],
            correct: 1
          }
        ]
      },
      {
        id: "geotechnical-engineering",
        name: "Geotechnical Engineering",
        icon: "Mountain",
        description: "Soil mechanics and foundation engineering",
        color: "from-amber-600 to-yellow-700",
        questions: [
          {
            question: "What is the liquid limit of soil?",
            options: ["Water content at plastic limit", "Water content at liquid limit", "Water content for flow", "Water content for shrinkage"],
            correct: 2
          },
          {
            question: "Which soil has the highest bearing capacity?",
            options: ["Clay", "Sand", "Gravel", "Silt"],
            correct: 2
          },
          {
            question: "What is the purpose of a soil investigation?",
            options: ["To find water", "To determine soil properties", "To locate minerals", "To check contamination"],
            correct: 1
          },
          {
            question: "Which test is used to determine soil permeability?",
            options: ["Direct shear test", "Triaxial test", "Constant head test", "Consolidation test"],
            correct: 2
          },
          {
            question: "What is the angle of repose?",
            options: ["Angle of internal friction", "Angle of slope stability", "Maximum stable slope angle", "All of the above"],
            correct: 3
          }
        ]
      },
      {
        id: "transportation-engineering",
        name: "Transportation Engineering",
        icon: "Truck",
        description: "Design and planning of transportation systems",
        color: "from-blue-700 to-indigo-800",
        questions: [
          {
            question: "What is the design speed for highways?",
            options: ["Speed for comfort", "Speed for safety", "Speed for economy", "All of the above"],
            correct: 3
          },
          {
            question: "Which factor affects traffic flow?",
            options: ["Vehicle characteristics", "Driver behavior", "Road conditions", "All of the above"],
            correct: 3
          },
          {
            question: "What is the capacity of a road?",
            options: ["Maximum speed", "Maximum flow rate", "Maximum vehicles", "Maximum distance"],
            correct: 1
          },
          {
            question: "Which method is used for traffic signal design?",
            options: ["Webster's method", "HCM method", "IRC method", "All of the above"],
            correct: 3
          },
          {
            question: "What is the purpose of a roundabout?",
            options: ["To increase speed", "To reduce conflicts", "To increase capacity", "To reduce cost"],
            correct: 1
          }
        ]
      },
      {
        id: "environmental-engineering",
        name: "Environmental Engineering",
        icon: "Leaf",
        description: "Water treatment and environmental protection",
        color: "from-green-600 to-emerald-700",
        questions: [
          {
            question: "What is BOD in water treatment?",
            options: ["Biological Oxygen Demand", "Biochemical Oxygen Demand", "Bacterial Oxygen Demand", "Biological Organic Demand"],
            correct: 1
          },
          {
            question: "Which process removes suspended solids?",
            options: ["Coagulation", "Flocculation", "Sedimentation", "Filtration"],
            correct: 2
          },
          {
            question: "What is the pH of drinking water?",
            options: ["6.5-8.5", "7.0-9.0", "5.5-9.5", "6.0-8.0"],
            correct: 0
          },
          {
            question: "Which gas is produced in anaerobic digestion?",
            options: ["Oxygen", "Carbon dioxide", "Methane", "Nitrogen"],
            correct: 2
          },
          {
            question: "What is the purpose of aeration in wastewater treatment?",
            options: ["To add oxygen", "To remove oxygen", "To add bacteria", "To remove bacteria"],
            correct: 0
          }
        ]
      }
    ]
  },
  {
    id: "eee",
    name: "Electrical and Electronics Engineering",
    icon: "Zap",
    description: "Master electrical systems, power engineering, and electronics",
    color: "from-yellow-500 to-orange-500",
    subjects: [
      {
        id: "electrical-machines",
        name: "Electrical Machines",
        icon: "Cog",
        description: "Study of transformers, motors, and generators",
        color: "from-orange-500 to-red-500",
        questions: [
          {
            question: "What is the main function of a transformer?",
            options: ["Store electrical energy", "Convert AC to DC", "Change voltage levels", "Generate electricity"],
            correct: 2
          },
          {
            question: "Which type of motor is commonly used in household appliances?",
            options: ["DC motor", "Induction motor", "Synchronous motor", "Stepper motor"],
            correct: 1
          },
          {
            question: "What is the slip in an induction motor?",
            options: ["Speed of rotor", "Difference between synchronous and rotor speed", "Torque produced", "Power factor"],
            correct: 1
          },
          {
            question: "Which material is used for transformer cores?",
            options: ["Copper", "Aluminum", "Silicon steel", "Plastic"],
            correct: 2
          },
          {
            question: "What is the efficiency of an ideal transformer?",
            options: ["50%", "75%", "90%", "100%"],
            correct: 3
          },
          {
            question: "Which winding in a transformer has more turns for step-up?",
            options: ["Primary", "Secondary", "Both same", "Depends on load"],
            correct: 1
          },
          {
            question: "What happens when a DC supply is given to a transformer?",
            options: ["It works normally", "Core gets saturated", "Voltage increases", "Current decreases"],
            correct: 1
          },
          {
            question: "Which motor is used in electric trains?",
            options: ["DC series motor", "DC shunt motor", "Induction motor", "Synchronous motor"],
            correct: 0
          },
          {
            question: "What is the power factor of an induction motor at no load?",
            options: ["0.1", "0.5", "0.8", "1.0"],
            correct: 0
          },
          {
            question: "Which type of generator is used in power plants?",
            options: ["DC generator", "AC synchronous generator", "Induction generator", "Single-phase generator"],
            correct: 1
          }
        ]
      },
      {
        id: "power-systems",
        name: "Power Systems",
        icon: "Bolt",
        description: "Analysis of power generation, transmission, and distribution",
        color: "from-red-500 to-pink-500",
        questions: [
          {
            question: "What is the standard frequency of AC power in India?",
            options: ["50 Hz", "60 Hz", "100 Hz", "120 Hz"],
            correct: 0
          },
          {
            question: "Which component is used to protect against lightning?",
            options: ["Fuse", "Circuit breaker", "Lightning arrester", "Relay"],
            correct: 2
          },
          {
            question: "What is the main advantage of three-phase system?",
            options: ["Less voltage", "More power transmission", "Easier control", "Cheaper equipment"],
            correct: 1
          },
          {
            question: "Which type of insulator is used in overhead transmission lines?",
            options: ["Pin insulator", "Suspension insulator", "Strain insulator", "Shackle insulator"],
            correct: 1
          },
          {
            question: "What is the purpose of a busbar?",
            options: ["Store energy", "Distribute power", "Control voltage", "Measure current"],
            correct: 1
          },
          {
            question: "Which relay operates based on current?",
            options: ["Voltage relay", "Power relay", "Current relay", "Frequency relay"],
            correct: 2
          },
          {
            question: "What is the voltage level for extra high voltage transmission?",
            options: ["11 kV", "33 kV", "132 kV", "400 kV"],
            correct: 3
          },
          {
            question: "Which type of fault is most common in power systems?",
            options: ["Single line to ground", "Line to line", "Double line to ground", "Three phase"],
            correct: 0
          },
          {
            question: "What is the function of a capacitor bank?",
            options: ["Store energy", "Improve power factor", "Control frequency", "Limit current"],
            correct: 1
          },
          {
            question: "Which device is used for voltage regulation?",
            options: ["Transformer", "Tap changing transformer", "Inductor", "Capacitor"],
            correct: 1
          }
        ]
      },
      {
        id: "control-systems",
        name: "Control Systems",
        icon: "Settings",
        description: "Principles of automatic control and feedback systems",
        color: "from-blue-500 to-indigo-500",
        questions: [
          {
            question: "What is the main purpose of a control system?",
            options: ["Generate power", "Control process variables", "Store data", "Display information"],
            correct: 1
          },
          {
            question: "Which type of control system uses feedback?",
            options: ["Open loop", "Closed loop", "Manual control", "Direct control"],
            correct: 1
          },
          {
            question: "What does PID stand for in controllers?",
            options: ["Proportional Integral Derivative", "Power Input Device", "Process Identification Data", "Programmable Interface Device"],
            correct: 0
          },
          {
            question: "Which component introduces phase lag in a system?",
            options: ["Differentiator", "Integrator", "Amplifier", "Comparator"],
            correct: 1
          },
          {
            question: "What is the steady state error in a control system?",
            options: ["Initial error", "Final error", "Maximum error", "Average error"],
            correct: 1
          },
          {
            question: "Which method is used for stability analysis?",
            options: ["Routh-Hurwitz", "Newton-Raphson", "Gauss-Seidel", "Runge-Kutta"],
            correct: 0
          },
          {
            question: "What is the transfer function of a system?",
            options: ["Input/Output ratio", "Output/Input ratio", "Error/Input ratio", "Feedback/Input ratio"],
            correct: 1
          },
          {
            question: "Which controller provides derivative action?",
            options: ["P controller", "I controller", "D controller", "PI controller"],
            correct: 2
          },
          {
            question: "What is the damping ratio in a second order system?",
            options: ["Natural frequency", "Settling time", "Overshoot factor", "Rise time"],
            correct: 2
          },
          {
            question: "Which type of system has poles in right half plane?",
            options: ["Stable", "Unstable", "Marginally stable", "Oscillatory"],
            correct: 1
          }
        ]
      },
      {
        id: "electrical-measurements",
        name: "Electrical Measurements and Instrumentation",
        icon: "Gauge",
        description: "Measurement techniques and instrumentation principles",
        color: "from-green-500 to-teal-500",
        questions: [
          {
            question: "Which instrument is used to measure current?",
            options: ["Voltmeter", "Ammeter", "Ohmmeter", "Wattmeter"],
            correct: 1
          },
          {
            question: "What is the principle of a Wheatstone bridge?",
            options: ["Voltage measurement", "Current measurement", "Resistance measurement", "Power measurement"],
            correct: 2
          },
          {
            question: "Which type of oscilloscope displays voltage vs time?",
            options: ["Spectrum analyzer", "Logic analyzer", "Digital storage oscilloscope", "Analog oscilloscope"],
            correct: 3
          },
          {
            question: "What is the accuracy class of a good quality meter?",
            options: ["0.1", "0.5", "1.0", "2.5"],
            correct: 0
          },
          {
            question: "Which transducer converts pressure to electrical signal?",
            options: ["Thermocouple", "Strain gauge", "Piezoelectric", "LVDT"],
            correct: 2
          },
          {
            question: "What is the function of a multimeter?",
            options: ["Measure voltage only", "Measure current only", "Measure multiple parameters", "Measure power only"],
            correct: 2
          },
          {
            question: "Which bridge is used for capacitance measurement?",
            options: ["Wheatstone", "Schering", "Kelvin", "Anderson"],
            correct: 1
          },
          {
            question: "What is the resolution of a digital instrument?",
            options: ["Smallest change detectable", "Maximum range", "Accuracy", "Precision"],
            correct: 0
          },
          {
            question: "Which instrument measures power?",
            options: ["Voltmeter", "Ammeter", "Wattmeter", "Ohmmeter"],
            correct: 2
          },
          {
            question: "What is the principle of a cathode ray oscilloscope?",
            options: ["Magnetic deflection", "Electrostatic deflection", "Both magnetic and electrostatic", "Light emission"],
            correct: 2
          }
        ]
      }
    ]
  },
  {
    id: "civil",
    name: "Civil Engineering",
    icon: "Building",
    description: "Learn structural engineering, construction, and infrastructure design",
    color: "from-stone-500 to-slate-500",
    subjects: [
      {
        id: "structural-engineering",
        name: "Structural Engineering",
        icon: "Triangle",
        description: "Analysis and design of structures and load-bearing systems",
        color: "from-gray-500 to-slate-500",
        questions: [
          {
            question: "What is the maximum bending moment in a simply supported beam?",
            options: ["At supports", "At center", "At quarter span", "At three-quarter span"],
            correct: 1
          },
          {
            question: "Which material has the highest compressive strength?",
            options: ["Wood", "Steel", "Concrete", "Brick"],
            correct: 1
          },
          {
            question: "What is the slenderness ratio for columns?",
            options: ["Length/Area", "Length/Radius", "Area/Length", "Radius/Length"],
            correct: 1
          },
          {
            question: "Which type of foundation is used in soft soils?",
            options: ["Shallow foundation", "Deep foundation", "Raft foundation", "Pile foundation"],
            correct: 3
          },
          {
            question: "What is the factor of safety for steel structures?",
            options: ["1.5", "2.0", "2.5", "3.0"],
            correct: 0
          },
          {
            question: "Which load is considered in structural design?",
            options: ["Dead load", "Live load", "Wind load", "All of the above"],
            correct: 3
          },
          {
            question: "What is the modulus of elasticity of steel?",
            options: ["2×10^5 MPa", "2×10^7 MPa", "2×10^8 MPa", "2×10^10 MPa"],
            correct: 2
          },
          {
            question: "Which section has maximum moment of inertia?",
            options: ["Circular", "Square", "Rectangular", "I-section"],
            correct: 3
          },
          {
            question: "What is the allowable stress in concrete?",
            options: ["5 MPa", "10 MPa", "15 MPa", "20 MPa"],
            correct: 0
          },
          {
            question: "Which type of joint is used in steel structures?",
            options: ["Welded", "Bolted", "Riveted", "All of the above"],
            correct: 3
          }
        ]
      },
      {
        id: "geotechnical-engineering",
        name: "Geotechnical Engineering",
        icon: "Mountain",
        description: "Study of soil mechanics and foundation engineering",
        color: "from-amber-500 to-yellow-500",
        questions: [
          {
            question: "What is the specific gravity of soil solids?",
            options: ["1.0", "2.65", "1.5", "3.0"],
            correct: 1
          },
          {
            question: "Which soil has the highest permeability?",
            options: ["Clay", "Silt", "Sand", "Gravel"],
            correct: 3
          },
          {
            question: "What is the liquid limit of soil?",
            options: ["Water content at plastic limit", "Water content at liquid limit", "Water content at shrinkage limit", "Water content at field capacity"],
            correct: 1
          },
          {
            question: "Which test is used to determine soil bearing capacity?",
            options: ["Standard penetration test", "Cone penetration test", "Plate load test", "All of the above"],
            correct: 3
          },
          {
            question: "What is the angle of repose for dry sand?",
            options: ["30°", "35°", "40°", "45°"],
            correct: 1
          },
          {
            question: "Which soil type has the highest swelling potential?",
            options: ["Sand", "Silt", "Clay", "Gravel"],
            correct: 2
          },
          {
            question: "What is the coefficient of consolidation?",
            options: ["Permeability", "Compressibility", "Both", "None"],
            correct: 2
          },
          {
            question: "Which foundation is suitable for expansive soils?",
            options: ["Shallow", "Deep", "Under-reamed pile", "Raft"],
            correct: 2
          },
          {
            question: "What is the shear strength of soil?",
            options: ["Cohesion + Normal stress × tanφ", "Cohesion - Normal stress × tanφ", "Normal stress × tanφ", "Cohesion only"],
            correct: 0
          },
          {
            question: "Which instrument measures pore water pressure?",
            options: ["Piezometer", "Manometer", "Barometer", "Hydrometer"],
            correct: 0
          }
        ]
      },
      {
        id: "transportation-engineering",
        name: "Transportation Engineering",
        icon: "Truck",
        description: "Design and planning of transportation systems",
        color: "from-blue-500 to-cyan-500",
        questions: [
          {
            question: "What is the design speed for highways?",
            options: ["30 km/h", "50 km/h", "80 km/h", "100 km/h"],
            correct: 1
          },
          {
            question: "Which type of pavement is flexible?",
            options: ["Concrete", "Bituminous", "Brick", "Stone"],
            correct: 1
          },
          {
            question: "What is the minimum sight distance for highways?",
            options: ["100 m", "150 m", "200 m", "250 m"],
            correct: 2
          },
          {
            question: "Which factor affects traffic flow?",
            options: ["Speed", "Density", "Volume", "All of the above"],
            correct: 3
          },
          {
            question: "What is the capacity of a lane?",
            options: ["1000 PCU/hr", "1500 PCU/hr", "2000 PCU/hr", "2500 PCU/hr"],
            correct: 2
          },
          {
            question: "Which type of intersection has the highest capacity?",
            options: ["Unsignalized", "Signalized", "Rotary", "Grade separated"],
            correct: 3
          },
          {
            question: "What is the super elevation on highways?",
            options: ["Cross slope", "Longitudinal slope", "Both", "None"],
            correct: 0
          },
          {
            question: "Which material is used for highway construction?",
            options: ["Bitumen", "Cement", "Aggregate", "All of the above"],
            correct: 3
          },
          {
            question: "What is the minimum width of a carriageway?",
            options: ["3.5 m", "5.5 m", "7.0 m", "9.0 m"],
            correct: 2
          },
          {
            question: "Which type of curve is used in highways?",
            options: ["Circular", "Transition", "Spiral", "All of the above"],
            correct: 3
          }
        ]
      },
      {
        id: "environmental-engineering",
        name: "Environmental Engineering",
        icon: "Leaf",
        description: "Water treatment, waste management, and environmental protection",
        color: "from-green-500 to-emerald-500",
        questions: [
          {
            question: "What is BOD in wastewater?",
            options: ["Biological Oxygen Demand", "Biochemical Oxygen Demand", "Bacterial Oxygen Demand", "Bio Oxygen Demand"],
            correct: 1
          },
          {
            question: "Which process removes suspended solids?",
            options: ["Sedimentation", "Filtration", "Coagulation", "All of the above"],
            correct: 3
          },
          {
            question: "What is the pH of drinking water?",
            options: ["6.0-7.0", "6.5-8.5", "7.0-9.0", "7.5-8.5"],
            correct: 1
          },
          {
            question: "Which gas is produced in anaerobic digestion?",
            options: ["Oxygen", "Carbon dioxide", "Methane", "Nitrogen"],
            correct: 2
          },
          {
            question: "What is the purpose of aeration in wastewater treatment?",
            options: ["To add oxygen", "To remove oxygen", "To add bacteria", "To remove bacteria"],
            correct: 0
          },
          {
            question: "Which disinfectant is used in water treatment?",
            options: ["Chlorine", "Ozone", "UV radiation", "All of the above"],
            correct: 3
          },
          {
            question: "What is the COD in wastewater?",
            options: ["Chemical Oxygen Demand", "Carbon Oxygen Demand", "Chlorine Oxygen Demand", "Complete Oxygen Demand"],
            correct: 0
          },
          {
            question: "Which type of pollution affects groundwater?",
            options: ["Air pollution", "Water pollution", "Soil pollution", "Noise pollution"],
            correct: 2
          },
          {
            question: "What is the efficiency of activated sludge process?",
            options: ["50%", "70%", "85%", "95%"],
            correct: 2
          },
          {
            question: "Which parameter indicates water quality?",
            options: ["Turbidity", "pH", "Dissolved oxygen", "All of the above"],
            correct: 3
          }
        ]
      }
    ]
  }
];

// For backward compatibility, export quizCategories as flattened subjects
export const quizCategories = courses.flatMap(course =>
  course.subjects.map(subject => ({
    ...subject,
    courseId: course.id,
    courseName: course.name
  }))
);


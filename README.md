# 🚀 **CPH-Leetcode Companion**

A **Visual Studio Code** extension designed to boost your **competitive programming** workflow. This extension seamlessly integrates LeetCode problem test cases into your development process, letting you fetch, modify, and validate your solutions with ease! 🧑‍💻✨

---

## 🌟 **Features**

### ✅ **1. Fetch Test Cases from LeetCode**  
- 🌐 Fetch input and output test cases directly from a LeetCode problem URL.  
- 🗂️ Avoid redundancy by reusing existing test case files.  
- 💾 Automatically saves test cases into files for easy access:
  - **`<problem_name>_inputs.txt`**: Contains input test cases.  
  - **`<problem_name>_outputs.txt`**: Contains expected output test cases.  
- 🧮 **Handles arrays and matrices** automatically by adding their sizes to the input file. No manual edits are needed!  
- ⚡ **Shortcut**: Use `Ctrl+Shift+P` and select `CPH: Fetch Test Cases`.  

---

### ✏️ **2. Modify Test Cases**  
- Easily edit input and output test cases using the generated files.  
- Supports running multiple custom test cases for flexibility.  

---

### ⚙️ **3. Run and Compare**  
- 🏃 Run your solution directly from the editor and **compare outputs** effortlessly.  
- **Detailed output** includes:
  - 🔹 Input test case  
  - 🔹 Expected output  
  - 🔹 Your output  
  - 🔹 Pass/Fail status for each test case  

---

### 🌍 **4. Multi-Language Support**  
Supports popular programming languages:  
- 🟦 **C++**  
- 🟩 **Python**

---

## 🔧 **Installation**

1. Clone the repository:  
   
   git clone https://github.com/g4mbl3r-145/cph-leetcode-companion.git

2. Now do **npm install** command so that all dependicies are installed in your system .
3. Now user can directly install **leetcode comapanion** from vscode extension download section.

4. Ensure ```npm``` is installed
   
     ``` 
     npm -v
     ```
   
   If npm is not installed, you can install it by following the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
   
- **Installing Extension**
1. Now extension can be installed directly from vs code in extension tab .
2. User can search for ```leetcode companion``` in extension tab in vscode .
3. Now extension can be tested .

### Developer working method
- Developer can open the repo and  run the code by running F5 command in vs code.
- Now He/she can test the extension.
   


## 🛠️ **Usage**

### 📥 **Fetch Test Cases**
1.  Open a workspace in Visual Studio Code (a folder must be opened to avoid errors).  
2.  Open the **Command Palette** (`Ctrl+Shift+P`).  
3.  Run the command: `CPH-Leetcode: Fetch Test Cases`.  
4.  Enter the **LeetCode problem URL** (e.g., `https://leetcode.com/problems/two-sum`).  
5.  Select the programming language (**C++** or **Python**).  
6.  The extension generates:  
   - **`<problem_name>.<extension>`**: A code template file.  
   - **`<problem_name>_inputs.txt`**: Contains input test cases.  
   - **`<problem_name>_outputs.txt`**: Contains expected output test cases.  

---


### ⚙️ **Run and Compare**
1.  Write your solution in the **generated code file**.  
2.  Open the **Command Palette** (`Ctrl+Shift+P`).  
3.  Run the command: `CPH-Leetcode: Run and Compare`.  
4.  The extension will:
   - Execute your code for each input test case.  
   - Compare outputs with the expected results.  
   - Display **detailed results** in the output channel, including:
     -  Input test case  
     -  Expected output  
     -  Your output  
     - ❌ Test case status (**Pass/Fail**)  

---

## 🛠️ **Example Workflow**

### **1. Fetch Test Cases**:
   -  URL: `https://leetcode.com/problems/two-sum`  
   -  Files Generated:
     - **`two-sum_inputs.txt`**  
     - **`two-sum_outputs.txt`**  
     - **`two-sum.cpp`** (or **`two-sum.py`**)  

### **2. Write Code**:
   -  Open **`two-sum.cpp`** (or **`two-sum.py`**).  
   -  Implement your solution in the provided template.  

### **3. Run and Compare**:
   -  Execute the **`Run and Compare`** command.  
   -  View the results in the output channel:
     -  Input  
     -  Expected Output  
     -  Your Output  
     -  Test case status (**Pass/Fail**)  

---

## 🧰 **Extension Commands**

| 🚀 **Command**                     | 🔍 **Description**                       |
|------------------------------------|------------------------------------------|
| `CPH-Leetcode: Fetch Test Cases`   | 📥 Fetch test cases from a LeetCode URL. |
| `CPH-Leetcode: Run and Compare`    | ⚙️ Run your solution and compare outputs. |

---

## ⚙️ **Requirements**

- **Programming Languages**:  
  - 🟩 **Python**: Ensure `python` is installed and added to your system's PATH.  
  - 🟦 **C++**: Ensure `g++` is installed and added to your system's PATH.  

---

## 🔮 **Future Enhancements**
  
-  Extend support for more programming languages.  
-  Add **submission commands** for direct LeetCode integration. 
- Now the extension is not getting packaged properly so in future this can be done properly so that uiser can directly install extension from vscode extension download.
- 

---

## 🤝 **Contributing**

Contributions are always welcome! 🙌 Whether it’s:  
-  Reporting bugs  
-  Suggesting features  
-  Submitting pull requests  

We appreciate your support!  

 Get started by exploring the repository:  
[**CPH-Leetcode Companion**](https://github.com/g4mbl3r-145/cph-leetcode-companion.git)

---

## 📜 **License**

 This extension is licensed under the **[MIT License](LICENSE)**.  
Feel free to **use**, **modify**, and **distribute** it! 🎉

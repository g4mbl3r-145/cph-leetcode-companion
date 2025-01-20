# CPH-Leetcode Extension

A Visual Studio Code extension designed to enhance the competitive programming experience. This extension seamlessly integrates LeetCode problem test cases into your development workflow, enabling you to fetch test cases, modify them, and validate your code with ease.

---

## Features

### 1. Fetch Test Cases from LeetCode
- Fetch input and output test cases directly from a LeetCode problem URL.
- Existing test case files are reused to avoid redundancy.
- Automatically saves test cases into files for easy access:
  - **`<problem_name>_inputs.txt`**: Contains input test cases.
  - **`<problem_name>_outputs.txt`**: Contains expected output test cases.
- **Shortcut**: Use `Ctrl+Shift+P` to open the Command Palette and select `CPH: Fetch Test Cases`.

### 2. Modify Test Cases
- Easily modify test cases by editing the input and output files.
- Supports running multiple custom test cases.

### 3. Run and Compare
- Run your solution directly from the editor and compare outputs.
- Detailed output includes:
  - Input test case
  - Expected output
  - Your output
  - Pass/fail status for each test case

### 4. Multi-Language Support
- Supports popular programming languages:
  - **C++**
  - **Python**

---

## Installation

1. First install the puppeteer in your system using `npm install puppeteer`.
2. Then search the extension leetcode-companion in extension bar and install it.
---

## Usage

### Fetch Test Cases
1. Open a workspace in Visual Studio Code (a folder must be opened to avoid errors).
2. Open the Command Palette (`Ctrl+Shift+P`).
3. Run the command `CPH-Leetcode: Fetch Test Cases`.
4. Enter the LeetCode problem URL (e.g., `https://leetcode.com/problems/two-sum`).
5. Select the programming language (C++ or Python).
6. The extension generates:
   - A code template file (`<problem_name>.<extension>`).
   - Input and output files (`<problem_name>_inputs.txt` and `<problem_name>_outputs.txt`).

### Run and Compare
1. Write your solution in the generated code file.
2. Open the Command Palette (`Ctrl+Shift+P`).
3. Run the command `CPH-Leetcode: Run and Compare`.
4. The extension will:
   - Execute your code for each input test case.
   - Compare outputs with the expected results.
   - Display detailed results in the output channel.

---

## Example Workflow

1. **Fetch Test Cases**:
   - URL: `https://leetcode.com/problems/two-sum`
   - Files generated:
     - `two-sum_inputs.txt`
     - `two-sum_outputs.txt`
     - `two-sum.cpp` (or `two-sum.py`)

2. **Write Code**:
   - Open `two-sum.cpp` (or `two-sum.py`).
   - Implement your solution in the provided template.

3. **Run and Compare**:
   - Execute the `Run and Compare` command.
   - View the results in the output channel, including:
     - Input
     - Expected Output
     - Your Output
     - Test case status (pass/fail)

---

## Extension Commands

| Command                       | Description                               |
|-------------------------------|-------------------------------------------|
| `CPH-Leetcode: Fetch Test Cases` | Fetch test cases from a LeetCode URL.     |
| `CPH-Leetcode: Run and Compare`  | Run your solution and compare outputs.    |

---

## Requirements

- **Programming Languages**:
  - For Python: Ensure `python` is installed and available in your system's PATH.
  - For C++: Ensure `g++` is installed and available in your system's PATH.

---

## Future Enhancements

- Automatically add vector/array sizes in test cases to improve usability and reduce manual input.
- Extend support for more programming languages.

---

## Contributing

Contributions are always welcome! Whether it’s reporting bugs, suggesting features, or submitting pull requests, we appreciate your support.

Get started by exploring the repository: [CPH-Leetcode Companion](https://github.com/g4mbl3r-145/cph-leetcode-companion.git).

---

## License

This extension is licensed under the [MIT License](LICENSE).

const fs = require("fs");
//Empty commend
let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;
//Add New Todo
const add_Function = () => {
  const text_ToAdd_Item = `${process.argv[3]} ${process.argv[4]}`;
  fs.appendFile(task_File_Path, `${text_ToAdd_Item}\n`, function (err) {
    if (err) {
      console.log("Error: File not found!");
    } else {
      if (!process.argv[4]) {
        console.log("Error: Missing tasks string. Nothing added!");
      } else
        console.log(
          `Added task: "${process.argv[4]}" with priority ${process.argv[3]}`
        );
    }
  });
};
//Display todolist
const ls_Function = () => {
  fs.readFile("./task.txt", "utf8", (err, data) => {
    if (err) {
      console.log("There are no pending tasks!");
      return;
    }
    const read_Lines = data.split("\n");
    var array = [];
    read_Lines.forEach((line) => {
      const firstCharacter = line.trim()[0];
      array.push(firstCharacter);
      array.sort();
    });

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - 1; j++) {
        if (array[i] == read_Lines[j].trim()[0]) {
          console.log(
            `${i + 1}.${read_Lines[j].slice(1, read_Lines[j].length)} [${
              array[i]
            }]`
          );
        }
      }
    }
  });
};
//delete todo with position
const delete_Todo = (pos) => {
  fs.readFile(task_File_Path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const read_Lines = data.split("\n");
    if (pos > 0 && pos < read_Lines.length) {
      read_Lines.splice(pos, 1);
    } else {
      console.log(
        `Error: task with index #${pos} does not exist. Nothing deleted.`
      );
      return;
    }

    const ofter_Delete = read_Lines.join("\n");
    fs.writeFile(task_File_Path, ofter_Delete, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Deleted task #${pos}`);
    });
  });
};
//Marked done
const mark_As_Done = async (pos) => {
  fs.readFile(task_File_Path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const read_Lines = data.split("\n");
    if (data.length !== 0 && pos <= read_Lines.length && pos != 0) {
      for (let i = 1; i <= read_Lines.length; i++) {
        if (pos == i) {
          var temp = read_Lines[pos - 1].slice(2, read_Lines[pos - 1].length);
        }
      }
      read_Lines.splice(pos - 1, 1);
      const ofter_Delete = read_Lines.join("\n");
      fs.writeFile(task_File_Path, ofter_Delete, "utf8", (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      fs.appendFile(completed_file_Path, `${temp}\n`, function (err) {
        console.log("Marked item as done.");
      });
    } else {
      console.log(`Error: no incomplete item with index #${pos} exists.`);
    }
  });
};
//display Report completed and pending
const displayReport = () => {
  fs.readFile("./task.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const read_Lines = data.split("\n");
    console.log(`Pending : ${read_Lines.length - 1}`);
    if (read_Lines[0] != " " && read_Lines[0].length != 0) {
      var array = [];
      read_Lines.forEach((line) => {
        const firstCharacter = line.trim()[0];
        array.push(firstCharacter);
        array.sort(); //short priority
      });
      for (let i = 0; i <= array.length - 2; i++) {
        for (let j = 0; j < array.length - 1; j++) {
          if (array[i] == read_Lines[j].trim()[0]) {
            console.log(
              `${i + 1}.${read_Lines[j].slice(1, read_Lines[j].length)} [${
                array[i]
              }]`
            );
          }
        }
      }
    }
  });
  fs.readFile(completed_file_Path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const read_Lines = data.split("\n");
    console.log();
    console.log(`Completed : ${read_Lines.length - 1}`);
    for (let i = 1; i <= read_Lines.length - 1; i++) {
      console.log(`${i}. ${read_Lines[i - 1]}`);
    }
  });
};
const task_File_Path = "./task.txt";
const completed_file_Path = "./completed.txt";
if (process.argv[2] == null) {
  console.log(usage);
} else if (process.argv[2] === "add") {
  add_Function();
} else if (process.argv[2] === "help") {
  console.log(usage);
} else if (process.argv[2] === "ls") {
  ls_Function();
} else if (process.argv[2] === "del") {
  if (!process.argv[3]) {
    console.log("Error: Missing NUMBER for deleting tasks.");
  } else {
    delete_Todo(process.argv[3]);
  }
} else if (process.argv[2] === "done") {
  if (!process.argv[3]) {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  } else {
    mark_As_Done(process.argv[3]);
  }
} else if (process.argv[2] == "report") {
  displayReport();
}

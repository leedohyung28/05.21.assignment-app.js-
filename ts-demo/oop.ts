class Employee {
  constructor(
    private _empName: string,
    private _age: number,
    private _empJob: string
  ) {}

  // getter
  get empName() {
    return this._empName;
  }

  // setter
  set empName(val: string) {
    this._empName = val;
  }

  printEmp = (): void => {
    console.log(
      `${this._empName}의 나이는 ${this._age}이고, 직업은 ${this._empJob}입니다.`
    );
  };
}

let employee1 = new Employee("lee", 27, "house keeper");

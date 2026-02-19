export class BrokerDTO {
  id: string;
  fname: string;
  lname: string;
  name: string; // full name
  email: string;
  phone?: string;
  role: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(broker: any) {
    this.id = broker._id.toString();

    this.fname = this.capitalize(broker.fname);
    this.lname = this.capitalize(broker.lname);

    this.name = `${this.fname} ${this.lname}`;

    this.email = broker.email;
    this.phone = broker.phone;
    this.role = broker.role;
    this.status = broker.status;

    this.createdAt = broker.createdAt;
    this.updatedAt = broker.updatedAt;
  }

  private capitalize(value: string): string {
    if (!value) return "";
    return value
      .toLowerCase()
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }
}

declare interface SubscriberDto extends Pick<Subscriber, "email" | "keywords"> {
    unsubscribeLink: string;
  }
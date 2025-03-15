function ContactNumberItem({ city, number }) {
    return (
      <div className="phone-item flex flex-col w-full">
        <div className="phone-title text-breadtext text-sm md:text-base">
          {city}
        </div>
        <div className="phone-number text-lg md:text-2xl mt-1 md:mt-3">
          {number}
        </div>
      </div>
    );
  }

export default ContactNumberItem;
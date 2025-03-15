function FooterLink({ text }) {
    return (
      <div className="about-us-item flex flex-col w-full">
        <a href="#">
          <h2 className="about-us-text hover:underline">{text}</h2>
        </a>
      </div>
    );
  }

export default FooterLink; 
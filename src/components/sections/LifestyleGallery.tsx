import LifestyleGalleryClient, { LifestyleCardItem } from "./LifestyleGalleryClient";

const DEFAULT_LIFESTYLE_CARDS: LifestyleCardItem[] = [
  {
    id: "handloom-sarees",
    tag: "Kosa Silk & Handlooms",
    title: "The Festive Handloom Edit",
    description:
      "Authentic wild Kosa silks and traditional drapes woven by master artisans on traditional pit-looms.",
    image: "/images/shadi_collection.png",
    href: "/collections/sarees",
    gridSpan: "lg:col-span-7 h-[420px] sm:h-[480px] lg:h-[500px]",
    imagePosition: "center 20%",
  },
  {
    id: "conscious-gifting",
    tag: "Conscious Gifting",
    title: "Thoughtful Keepsakes & Hampers",
    description:
      "Curated gift boxes, hand-bound journals, and botanical accents celebrating ethical craftsmanship.",
    image: "/images/seasonal_edit.png",
    href: "/collections/gift-hampers",
    gridSpan: "lg:col-span-5 h-[420px] sm:h-[480px] lg:h-[500px]",
    imagePosition: "center 25%",
  },
  {
    id: "cotton-kurtis",
    tag: "Handspun Cotton",
    title: "Easy Kurtis & Daily Drapes",
    description:
      "Breathable silhouettes woven from pure natural cottons for everyday elegance.",
    image: "/images/custom_outfit.jpeg",
    href: "/collections/easy-cotton-kurtis",
    gridSpan: "lg:col-span-4 h-[350px] sm:h-[390px]",
    imagePosition: "center 20%",
  },
  {
    id: "textile-toys",
    tag: "Upcycled & Zero-Waste",
    title: "Hand-Embroidered Textile Toys",
    description:
      "Playful fabric keepsakes lovingly stitched by women artisans from reclaimed handloom remnants.",
    image: "/images/toy_elephant2.jpeg",
    href: "/collections/textile-toys",
    gridSpan: "lg:col-span-4 h-[350px] sm:h-[390px]",
    imagePosition: "center center",
  },
  {
    id: "tribal-home-crafts",
    tag: "Tribal & Living Spaces",
    title: "Living Spaces & Indigenous Art",
    description:
      "Dhokra metal casting, natural grass baskets, and folk art honoring ancient forest traditions.",
    image: "/images/artesian/image6.png",
    href: "/collections/tribal-artisan-crafts",
    gridSpan: "lg:col-span-4 h-[350px] sm:h-[390px]",
    imagePosition: "center center",
  },
];

export interface LifestyleGalleryProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  cards?: LifestyleCardItem[];
}

export default async function LifestyleGallery(props: LifestyleGalleryProps) {
  const cards = props.cards && props.cards.length > 0 ? props.cards : DEFAULT_LIFESTYLE_CARDS;

  return (
    <LifestyleGalleryClient
      eyebrow={props.eyebrow}
      title={props.title}
      highlight={props.highlight}
      description={props.description}
      cards={cards}
    />
  );
}

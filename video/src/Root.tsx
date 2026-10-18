import { Composition } from "remotion";
import { NouvelArrivage, produitSchema } from "./NouvelArrivage";
import { NouvelArrivageCinema, cinemaSchema } from "./NouvelArrivageCinema";
import { CerveauKalo } from "./CerveauKalo";
import { VitrineEcran } from "./VitrineEcran";

// Modèle vidéo Kalo « Nouvel arrivage » : vertical 1080 × 1920, 30 i/s, 15 s.
// Les données produit ont le même format que les affiches (visuels/produits/*.json).
export const RemotionRoot = () => {
  return (
    <>
    <Composition
      id="NouvelArrivage"
      component={NouvelArrivage}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      schema={produitSchema}
      defaultProps={{
        fond: "#009BDE",
        produit: "Lave-linge Hisense<br>7 kg",
        specs: ["1200 tr/min · Inverter · Vapeur", "Blanc", "Réf. : WF1I7022BWJ"],
        prix: "379",
        classe: "E",
        photo: "packshots/hisense-WF1I7022BWJ.png",
      }}
    />
    <Composition
      id="NouvelArrivageCinema"
      component={NouvelArrivageCinema}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
      schema={cinemaSchema}
      defaultProps={{
        fond: "#009BDE",
        produit: "Lave-linge Hisense<br>7 kg",
        specs: ["1200 tr/min · Inverter · Vapeur", "Blanc", "Réf. : WF1I7022BWJ"],
        prix: "379",
        classe: "E",
        photo: "packshots/hisense-WF1I7022BWJ.png",
        galerie: [
          "packshots/hisense-WF1I6022BT.png",
          "packshots/hisense-WF1I7022BT.png",
          "packshots/hyundai-HYWM-1040E.png",
          "packshots/hisense-WF1I7022BWJ.png",
        ],
      }}
    />
    <Composition
      id="CerveauKalo"
      component={CerveauKalo}
      durationInFrames={660}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="VitrineEcran"
      component={VitrineEcran}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />
    </>
  );
};
